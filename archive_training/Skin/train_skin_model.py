import os, json
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from tensorflow.keras import layers, Model, optimizers, callbacks # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore

# -------- SETTINGS --------
BASE_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\dataset\Skin"

MODEL_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\models\Skin"
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH = 12

EPOCHS_STAGE1 = 5
EPOCHS_STAGE2 = 50

LR_HEAD = 1e-3
LR_FINETUNE = 2e-5

UNFREEZE_LAYERS = 160

TTA_TIMES = 5
LABEL_SMOOTHING = 0.03

# -------- PATHS --------
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "valid")
TEST_DIR  = os.path.join(BASE_DIR, "test")

# -------- PREPROCESS --------
def ensure_rgb(img):
    if img.ndim == 2:
        img = np.stack([img]*3, axis=-1)
    elif img.ndim == 3 and img.shape[2] == 1:
        img = np.concatenate([img]*3, axis=-1)
    return img

def preprocess_img(img):
    img = ensure_rgb(img)
    img = tf.image.adjust_contrast(img, 1.2)
    img = tf.image.adjust_brightness(img, 0.02)
    return img

# -------- DATA --------
train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_img,
    rescale=1./255,
    rotation_range=15,
    width_shift_range=0.08,
    height_shift_range=0.08,
    zoom_range=0.15,
    brightness_range=(0.9,1.1),
    horizontal_flip=True
)

val_datagen  = ImageDataGenerator(preprocessing_function=preprocess_img, rescale=1./255)
test_datagen = ImageDataGenerator(preprocessing_function=preprocess_img, rescale=1./255)

tta_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_img,
    rescale=1./255,
    rotation_range=4,
    zoom_range=0.04
)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH,
    class_mode='categorical',
    color_mode='rgb'
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH,
    class_mode='categorical',
    shuffle=False,
    color_mode='rgb'
)

test_gen = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH,
    class_mode='categorical',
    shuffle=False,
    color_mode='rgb'
)

# -------- SAVE LABEL MAP --------
with open(os.path.join(MODEL_DIR, "skin_labels.json"), "w") as f:
    json.dump(train_gen.class_indices, f)

print("Class mapping:", train_gen.class_indices)

# -------- CLASS WEIGHTS --------
class_weights = {
    0: 0.95,
    1: 1.3,
    2: 1.25
}

# -------- MODEL --------
base = MobileNetV2(
    include_top=False,
    input_shape=(224,224,3),
    weights='imagenet',
    pooling='avg'
)

x = base.output
x = layers.Dense(512, activation='relu')(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.5)(x)
out = layers.Dense(len(train_gen.class_indices), activation='softmax')(x)

model = Model(base.input, out)

for layer in base.layers:
    layer.trainable = False

loss_fn = tf.keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING)

model.compile(
    optimizer=optimizers.Adam(LR_HEAD),
    loss=loss_fn,
    metrics=['accuracy']
)

MODEL_OUT = os.path.join(MODEL_DIR, "skin_model.h5")

cb = [
    callbacks.ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True, verbose=1),
    callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1),
    callbacks.EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True, verbose=1)
]

# -------- TRAIN --------
model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=EPOCHS_STAGE1,
    class_weight=class_weights,
    callbacks=cb
)

# -------- FINE TUNE --------
for layer in base.layers[-UNFREEZE_LAYERS:]:
    layer.trainable = True

model.compile(
    optimizer=optimizers.Adam(LR_FINETUNE),
    loss=loss_fn,
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

# -------- TTA --------
def tta_predict(model):
    preds = []
    for _ in range(TTA_TIMES):
        gen = tta_datagen.flow_from_directory(
            TEST_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH,
            class_mode=None,
            shuffle=False,
            color_mode='rgb'
        )
        preds.append(model.predict(gen))
    return np.mean(preds, axis=0)

tta_preds = tta_predict(best_model)
y_true = test_gen.classes
y_pred = np.argmax(tta_preds, axis=1)

print("TTA Accuracy:", accuracy_score(y_true, y_pred))
print(classification_report(y_true, y_pred))
print(confusion_matrix(y_true, y_pred))

print("🔥 Skin model ready 🔥")