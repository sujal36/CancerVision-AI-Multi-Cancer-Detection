import os, json, math
import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from tensorflow.keras import layers, Model, optimizers, callbacks  # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore
from tensorflow.keras.utils import Sequence # type: ignore

# -------- SETTINGS --------
BASE_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\dataset\Brain"

MODEL_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\models\Brain"
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH = 16
EPOCHS_STAGE1 = 5
EPOCHS_STAGE2 = 50

LR_HEAD = 1e-3
LR_FINETUNE = 5e-5
UNFREEZE_LAYERS = 100

TTA_TIMES = 6
USE_MIXUP = True
MIXUP_ALPHA = 0.2
LABEL_SMOOTHING = 0.05

# -------- PATHS --------
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "valid")
TEST_DIR  = os.path.join(BASE_DIR, "test")

# -------- DATA --------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    width_shift_range=0.05,
    height_shift_range=0.05,
    zoom_range=0.08,
    horizontal_flip=False
)

val_datagen  = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

tta_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=5,
    zoom_range=0.05
)

train_gen = train_datagen.flow_from_directory(TRAIN_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical')
val_gen   = val_datagen.flow_from_directory(VAL_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical', shuffle=False)
test_gen  = test_datagen.flow_from_directory(TEST_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical', shuffle=False)

# -------- SAVE LABEL MAP --------
with open(os.path.join(MODEL_DIR, "brain_labels.json"), "w") as f:
    json.dump(train_gen.class_indices, f)

# -------- CLASS WEIGHTS --------
weights = compute_class_weight("balanced", classes=np.unique(train_gen.classes), y=train_gen.classes)
class_weights = dict(enumerate(weights))

# -------- MODEL --------
base = MobileNetV2(include_top=False, input_shape=(224,224,3), weights='imagenet', pooling='avg')

x = base.output
x = layers.Dense(512, activation='relu')(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.4)(x)
out = layers.Dense(len(train_gen.class_indices), activation='softmax')(x)

model = Model(base.input, out)

for layer in base.layers:
    layer.trainable = False

loss_fn = tf.keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING)

model.compile(optimizer=optimizers.Adam(LR_HEAD), loss=loss_fn, metrics=['accuracy'])

MODEL_OUT = os.path.join(MODEL_DIR, "brain_model.h5")

cb = [
    callbacks.ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True),
    callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3),
    callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
]

# -------- MIXUP --------
class MixupGenerator(Sequence):
    def __init__(self, gen, alpha=0.2):
        self.gen = gen
        self.alpha = alpha
        self.steps = len(gen)

    def __len__(self):
        return self.steps

    def __getitem__(self, i):
        x1,y1 = self.gen[i]
        j = np.random.randint(0,self.steps)
        x2,y2 = self.gen[j]
        lam = np.random.beta(self.alpha,self.alpha)
        return lam*x1+(1-lam)*x2, lam*y1+(1-lam)*y2

train_data = MixupGenerator(train_gen) if USE_MIXUP else train_gen

# -------- TRAIN --------
model.fit(train_data, validation_data=val_gen, epochs=EPOCHS_STAGE1,
          class_weight=class_weights, callbacks=cb)

# -------- FINE TUNE --------
for layer in base.layers[-UNFREEZE_LAYERS:]:
    layer.trainable = True

model.compile(optimizer=optimizers.Adam(LR_FINETUNE), loss=loss_fn, metrics=['accuracy'])

model.fit(train_data, validation_data=val_gen,
          epochs=EPOCHS_STAGE1+EPOCHS_STAGE2,
          initial_epoch=EPOCHS_STAGE1,
          class_weight=class_weights,
          callbacks=cb)

# -------- LOAD BEST --------
best_model = tf.keras.models.load_model(MODEL_OUT)

# -------- TTA --------
def tta_predict(model):
    preds = []
    for _ in range(TTA_TIMES):
        gen = tta_datagen.flow_from_directory(TEST_DIR, target_size=IMG_SIZE,
                                              batch_size=BATCH, class_mode=None, shuffle=False)
        preds.append(model.predict(gen))
    return np.mean(preds, axis=0)

tta_preds = tta_predict(best_model)
y_true = test_gen.classes
y_pred = np.argmax(tta_preds, axis=1)

print("TTA Accuracy:", accuracy_score(y_true,y_pred))
print(classification_report(y_true,y_pred))
print(confusion_matrix(y_true,y_pred))

print("✅ Brain model ready 🚀")