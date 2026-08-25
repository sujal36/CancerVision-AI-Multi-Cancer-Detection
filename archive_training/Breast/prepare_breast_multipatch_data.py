import os
import random
import cv2 # type: ignore
import numpy as np

BASE_PATH = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\dataset\Breast"

SETS = ["train", "valid", "test"]

IMG_SIZE = (224,224)
PATCHES = 5

classes = {
    "normal": 0,
    "ductal_carcinoma": 1
}

def load_and_resize(img_path):
    img = cv2.imread(img_path)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0
    return img

def prepare_set(set_name):
    X = []
    y = []

    print(f"\nProcessing {set_name} 🔥")

    for class_name, label in classes.items():
        class_path = os.path.join(BASE_PATH, set_name, class_name)

        patient_dict = {}

        for img_name in os.listdir(class_path):
            patient_id = img_name.split("_")[0]

            if patient_id not in patient_dict:
                patient_dict[patient_id] = []

            patient_dict[patient_id].append(img_name)

        for patient, images in patient_dict.items():
            random.shuffle(images)

            for i in range(0, len(images) - PATCHES + 1, PATCHES):
                group = images[i:i+PATCHES]

                patches = []
                for img in group:
                    img_path = os.path.join(class_path, img)
                    patches.append(load_and_resize(img_path))

                X.append(patches)
                y.append(label)

    X = np.array(X)
    y = np.array(y)

    print(f"{set_name} done ✅")
    print("Shape:", X.shape)

    return X, y

# -------- RUN ALL --------

X_train, y_train = prepare_set("train")
X_val, y_val     = prepare_set("valid")
X_test, y_test   = prepare_set("test")

# -------- SAVE --------

np.save("X_train.npy", X_train)
np.save("y_train.npy", y_train)

np.save("X_val.npy", X_val)
np.save("y_val.npy", y_val)

np.save("X_test.npy", X_test)
np.save("y_test.npy", y_test)

print("\n🔥 ALL DATA READY BRO 🔥")