import numpy as np
import tensorflow as tf
import cv2 # type: ignore
from PIL import Image
import os

# =========================
# IMAGE PREP
# =========================
def load_image(path, size=(224,224)):
    img = Image.open(path).convert("RGB")

    # 🔥 ORIGINAL IMAGE (DISPLAY KE LIYE)
    original = np.array(img)

    # 🔥 MODEL INPUT (RESIZED)
    img_resized = img.resize(size)
    arr = np.array(img_resized) / 255.0

    return np.expand_dims(arr, axis=0), original

# =========================
# GRADCAM CORE
# =========================
def make_gradcam_heatmap(img_array, model, last_conv_layer_name):

    grad_model = tf.keras.models.Model(
        [model.inputs],
        [model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)
        class_idx = tf.argmax(predictions[0])
        loss = predictions[:, class_idx]

    grads = tape.gradient(loss, conv_outputs)

    pooled_grads = tf.reduce_mean(grads, axis=(0,1,2))
    conv_outputs = conv_outputs[0]

    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

# =========================
# OVERLAY FUNCTION
# =========================
def overlay_heatmap(original_img, heatmap, alpha=0.4):

    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    superimposed = cv2.addWeighted(original_img, 1-alpha, heatmap, alpha, 0)

    return superimposed

# =========================
# MAIN FUNCTION
# =========================
def generate_gradcam(image_path, model, save_path="static/gradcam.jpg", last_conv_layer_name=None):

    img_array, original_img = load_image(image_path)

    # 🔥 auto detect last conv layer if not given
    if last_conv_layer_name is None:
        for layer in reversed(model.layers):
            if isinstance(layer, tf.keras.layers.Conv2D):
                last_conv_layer_name = layer.name
                break

    heatmap = make_gradcam_heatmap(img_array, model, last_conv_layer_name)
    result = overlay_heatmap(original_img, heatmap)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    cv2.imwrite(save_path, result)

    return save_path