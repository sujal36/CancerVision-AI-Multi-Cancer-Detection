import os, json, numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from tensorflow.keras import layers, Model, optimizers, callbacks # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore

# -------- SETTINGS --------
BASE_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\dataset\Breast"

MODEL_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\models\Breast"
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH = 16
EPOCHS_STAGE1 = 5
EPOCHS_STAGE2 = 25

LR_HEAD = 1e-3
LR_FINETUNE = 5e-5
UNFREEZE_LAYERS = 80

TTA_TIMES = 10
THRESHOLD = 0.42

# -------- PATHS --------
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "valid")
TEST_DIR  = os.path.join(BASE_DIR, "test")

MODEL_OUT = os.path.join(MODEL_DIR, "breast_fallback.keras")

# -------- DATA --------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    zoom_range=0.1,
    horizontal_flip=True
)

val_datagen  = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

tta_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    zoom_range=0.1,
    horizontal_flip=True,
    vertical_flip=True
)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='binary'
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='binary', shuffle=False
)

test_gen = test_datagen.flow_from_directory(
    TEST_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='binary', shuffle=False
)

# -------- SAVE LABEL MAP --------
with open(os.path.join(MODEL_DIR, "breast_labels.json"), "w") as f:
    json.dump(train_gen.class_indices, f)

# -------- CLASS WEIGHTS --------
class_weights = {0: 1.0, 1: 1.4}

# -------- MODEL --------
base = MobileNetV2(include_top=False, input_shape=(224,224,3), weights='imagenet', pooling='avg')

x = base.output
x = layers.Dense(256, activation='relu')(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.4)(x)
out = layers.Dense(1, activation='sigmoid')(x)

model = Model(base.input, out)

for layer in base.layers:
    layer.trainable = False

model.compile(
    optimizer=optimizers.Adam(LR_HEAD),
    loss=tf.keras.losses.BinaryCrossentropy(label_smoothing=0.05),
    metrics=['accuracy']
)

cb = [
    callbacks.ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True),
    callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3),
    callbacks.EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True)
]

# -------- TRAIN --------
model.fit(train_gen, validation_data=val_gen,
          epochs=EPOCHS_STAGE1,
          class_weight=class_weights,
          callbacks=cb)

# -------- FINE TUNE --------
for layer in base.layers[-UNFREEZE_LAYERS:]:
    layer.trainable = True

model.compile(
    optimizer=optimizers.Adam(LR_FINETUNE),
    loss=tf.keras.losses.BinaryCrossentropy(label_smoothing=0.05),
    metrics=['accuracy']
)

model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_STAGE1 + EPOCHS_STAGE2,
    initial_epoch=EPOCHS_STAGE1,
    class_weight=class_weights,
    callbacks=cb
)

# -------- LOAD BEST --------
best_model = tf.keras.models.load_model(MODEL_OUT)

# -------- TTA FUNCTION --------
def tta_predict(img):
    preds = []
    for _ in range(TTA_TIMES):
        aug = tta_datagen.random_transform(img)
        aug = np.expand_dims(aug, axis=0)
        pred = best_model.predict(aug, verbose=0)[0][0]
        preds.append(pred)
    return np.mean(preds)

# -------- EVALUATION --------
y_true = test_gen.classes
y_pred = []

for i in range(len(test_gen)):
    imgs, _ = test_gen[i]
    for img in imgs:
        p = tta_predict(img)
        y_pred.append(1 if p > THRESHOLD else 0)

y_pred = np.array(y_pred[:len(y_true)])

print("🔥 FINAL TTA Accuracy:", accuracy_score(y_true, y_pred))
print(classification_report(y_true, y_pred))
print(confusion_matrix(y_true, y_pred))

print("🚀 Breast Fallback Model Ready 🚀")