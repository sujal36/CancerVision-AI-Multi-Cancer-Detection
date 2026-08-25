import os
import shutil
import random

# 🔥 FIX: reproducibility
random.seed(42)

# -------- PATHS --------
BASE_DATASET = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\dataset"
OUTPUT_DIR   = r"E:\FINAL Year Project Protoypes\CancerXrayWebAppMain7\gatekeeper_dataset"

ORGANS = ["Lung", "Brain", "Skin", "Breast"]

TARGET_TRAIN = 6400
TARGET_TEST  = 1600

# -------- CREATE FOLDERS --------
for split in ["train", "valid", "test"]:
    for organ in ORGANS:
        os.makedirs(os.path.join(OUTPUT_DIR, split, organ.lower()), exist_ok=True)

# -------- GET ALL IMAGES --------
def get_all_images(folder):
    files = []
    for root, _, f_list in os.walk(folder):
        for f in f_list:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.tif')):
                files.append(os.path.join(root, f))
    return files

# -------- COPY --------
def copy_list(files, dest_folder):
    for file in files:
        fname = os.path.basename(file)
        dest = os.path.join(dest_folder, fname)

        count = 1
        while os.path.exists(dest):
            name, ext = os.path.splitext(fname)
            dest = os.path.join(dest_folder, f"{name}_{count}{ext}")
            count += 1

        shutil.copy(file, dest)

# -------- MAIN --------
for organ in ORGANS:
    print(f"\n🔥 Processing {organ}...")

    train_files = get_all_images(os.path.join(BASE_DATASET, organ, "train"))
    valid_files = get_all_images(os.path.join(BASE_DATASET, organ, "valid"))
    test_files  = get_all_images(os.path.join(BASE_DATASET, organ, "test"))

    # shuffle (now reproducible)
    random.shuffle(train_files)
    random.shuffle(valid_files)
    random.shuffle(test_files)

    # ========================
    # 🟢 TRAIN BUILD
    # ========================
    train_split = train_files[:min(len(train_files), TARGET_TRAIN)]

    remaining_needed = TARGET_TRAIN - len(train_split)

    if remaining_needed > 0:
        take_from_valid = min(len(valid_files), remaining_needed)
        train_split += valid_files[:take_from_valid]
        valid_files = valid_files[take_from_valid:]

        remaining_needed -= take_from_valid

    if remaining_needed > 0:
        take_from_test = min(len(test_files), remaining_needed)
        train_split += test_files[:take_from_test]
        test_files = test_files[take_from_test:]

    # ========================
    # 🔵 TEST BUILD
    # ========================
    test_split = test_files[:min(len(test_files), TARGET_TEST)]

    remaining_needed = TARGET_TEST - len(test_split)

    if remaining_needed > 0:
        take_from_valid = min(len(valid_files), remaining_needed)
        test_split += valid_files[:take_from_valid]
        valid_files = valid_files[take_from_valid:]

    # ========================
    # 🟡 VALID BUILD
    # ========================
    valid_split = valid_files

    # ========================
    # COPY
    # ========================
    copy_list(train_split, os.path.join(OUTPUT_DIR, "train", organ.lower()))
    copy_list(test_split,  os.path.join(OUTPUT_DIR, "test", organ.lower()))
    copy_list(valid_split, os.path.join(OUTPUT_DIR, "valid", organ.lower()))

    print(f"  ✅ Train: {len(train_split)} | Test: {len(test_split)} | Valid: {len(valid_split)}")

print("\n💀🔥 Gatekeeper dataset READY (REPRODUCIBLE + CLEAN)")