import os, json
import numpy as np
import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

from tensorflow.keras import layers, Model, optimizers, callbacks # type: ignore
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore

# -------- SETTINGS --------
BASE_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\gatekeeper_dataset"

MODEL_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\models\Gatekeeper"
os.makedirs(MODEL_DIR, exist_ok=True)

IMG_SIZE = (224, 224)
BATCH = 16

EPOCHS_STAGE1 = 5
EPOCHS_STAGE2 = 25

LR_HEAD = 1e-3
LR_FINETUNE = 5e-5
UNFREEZE_LAYERS = 80

LABEL_SMOOTHING = 0.05

# -------- PATHS --------
TRAIN_DIR = os.path.join(BASE_DIR, "train")
VAL_DIR   = os.path.join(BASE_DIR, "valid")
TEST_DIR  = os.path.join(BASE_DIR, "test")

# -------- MODEL OUTPUT --------
MODEL_OUT = os.path.join(MODEL_DIR, "gatekeeper_model.keras")

# -------- DATA --------
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    zoom_range=0.1,
    width_shift_range=0.05,
    height_shift_range=0.05,
    brightness_range=[0.8,1.2]
)

val_datagen  = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

train_gen = train_datagen.flow_from_directory(
    TRAIN_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical'
)

val_gen = val_datagen.flow_from_directory(
    VAL_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical', shuffle=False
)

test_gen = test_datagen.flow_from_directory(
    TEST_DIR, target_size=IMG_SIZE, batch_size=BATCH, class_mode='categorical', shuffle=False
)

# -------- SAVE LABEL MAP --------
with open(os.path.join(MODEL_DIR, "gatekeeper_labels.json"), "w") as f:
    json.dump(train_gen.class_indices, f)

# -------- CLASS WEIGHTS --------
weights = compute_class_weight(
    "balanced",
    classes=np.unique(train_gen.classes),
    y=train_gen.classes
)
class_weights = dict(enumerate(weights))

# -------- MODEL --------
base = MobileNetV2(
    include_top=False,
    input_shape=(224,224,3),
    weights='imagenet',
    pooling='avg'
)

x = base.output
x = layers.Dense(256, activation='relu')(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.3)(x)

out = layers.Dense(len(train_gen.class_indices), activation='softmax')(x)

model = Model(base.input, out)

# Freeze backbone
for layer in base.layers:
    layer.trainable = False

loss_fn = tf.keras.losses.CategoricalCrossentropy(
    label_smoothing=LABEL_SMOOTHING
)

model.compile(
    optimizer=optimizers.Adam(LR_HEAD),
    loss=loss_fn,
    metrics=['accuracy']
)

# -------- CALLBACKS --------
cb = [
    callbacks.ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True),
    callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3),
    callbacks.EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True)
]

# -------- TRAIN HEAD --------
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

# -------- EVALUATION --------
best_model = tf.keras.models.load_model(MODEL_OUT)

y_true = test_gen.classes
preds = best_model.predict(test_gen)
y_pred = np.argmax(preds, axis=1)

print("\n🔥 Gatekeeper Accuracy:", accuracy_score(y_true, y_pred))
print(classification_report(y_true, y_pred))
print(confusion_matrix(y_true, y_pred))

print("\n💀🔥 Gatekeeper Model Ready 🚀")