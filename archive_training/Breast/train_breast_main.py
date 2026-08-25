import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model, callbacks, optimizers # type: ignore
from tensorflow.keras.applications import MobileNetV2 # type: ignore
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.utils import shuffle

# -------- PATHS --------
BASE_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\archive_training\breast\multipatch_data"

MODEL_DIR = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\models\Breast"
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_OUT = os.path.join(MODEL_DIR, "breast_main.keras")

# -------- LOAD DATA --------
X_train = np.load(os.path.join(BASE_DIR, "X_train.npy"))
y_train = np.load(os.path.join(BASE_DIR, "y_train.npy"))

X_val = np.load(os.path.join(BASE_DIR, "X_val.npy"))
y_val = np.load(os.path.join(BASE_DIR, "y_val.npy"))

X_test = np.load(os.path.join(BASE_DIR, "X_test.npy"))
y_test = np.load(os.path.join(BASE_DIR, "y_test.npy"))

# -------- SHUFFLE --------
X_train, y_train = shuffle(X_train, y_train, random_state=42)
X_val, y_val = shuffle(X_val, y_val, random_state=42)

PATCHES = X_train.shape[1]

print("Train:", np.unique(y_train, return_counts=True))
print("Val:", np.unique(y_val, return_counts=True))

# -------- MODEL --------
base = MobileNetV2(
    include_top=False,
    input_shape=(224,224,3),
    weights='imagenet',
    pooling='avg'
)

for layer in base.layers:
    layer.trainable = False

inputs = []
features = []

for i in range(PATCHES):
    inp = layers.Input(shape=(224,224,3))
    x = base(inp)
    inputs.append(inp)
    features.append(x)

# -------- CONCAT --------
x = layers.Concatenate()(features)

x = layers.Dense(256, activation='relu')(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.5)(x)

out = layers.Dense(1, activation='sigmoid')(x)

model = Model(inputs, out)

model.compile(
    optimizer=optimizers.Adam(1e-4),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# -------- CALLBACKS --------
cb = [
    callbacks.ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True),
    callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3),
    callbacks.EarlyStopping(monitor='val_loss', patience=6, restore_best_weights=True)
]

# -------- TRAIN --------
model.fit(
    [X_train[:,i] for i in range(PATCHES)],
    y_train,
    validation_data=([X_val[:,i] for i in range(PATCHES)], y_val),
    epochs=12,
    batch_size=4,
    callbacks=cb
)

# -------- FINE TUNE --------
for layer in base.layers[-50:]:
    layer.trainable = True

model.compile(
    optimizer=optimizers.Adam(5e-5),
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.fit(
    [X_train[:,i] for i in range(PATCHES)],
    y_train,
    validation_data=([X_val[:,i] for i in range(PATCHES)], y_val),
    epochs=40,
    initial_epoch=12,
    batch_size=4,
    callbacks=cb
)

# -------- LOAD BEST --------
best_model = tf.keras.models.load_model(MODEL_OUT)

# -------- PREDICT --------
preds = best_model.predict([X_test[:,i] for i in range(PATCHES)])

y_pred = (preds > 0.5).astype(int).flatten()

# -------- RESULTS --------
print("Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

print("🔥 Breast MAIN model ready 🔥")