import random
import shutil
from pathlib import Path

# Project directory
BASE_DIR = Path(__file__).resolve().parent

# Automatically find the source dataset folder
print("Searching for soil dataset...\n")

matches = [
    path
    for folder_name in ("Original-Dataset", "Orignal-Dataset")
    for path in BASE_DIR.rglob(folder_name)
]

if not matches:
    raise FileNotFoundError(
        "Original-Dataset or Orignal-Dataset folder not found!\n"
        "Please check where your soil images are stored."
    )

SOURCE_DIR = matches[0]

print("Dataset found at:", SOURCE_DIR)

# Output directory
OUTPUT_DIR = BASE_DIR / "dataset" / "prepared_dataset"

# Split percentages
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15

# Supported image formats
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}

# Reproducible random splitting
random.seed(42)

# Avoid overwriting an existing prepared dataset
if OUTPUT_DIR.exists():
    print(f"\nPrepared dataset already exists: {OUTPUT_DIR}")
    print("Skipping preparation to avoid overwriting it.")
    raise SystemExit(0)

print("\nPreparing soil dataset...\n")

total_images = 0

# Process each soil category
for class_dir in sorted(SOURCE_DIR.iterdir()):

    if not class_dir.is_dir():
        continue

    images = [
        file for file in class_dir.iterdir()
        if file.suffix.lower() in IMAGE_EXTENSIONS
    ]

    if not images:
        print(f"Skipping empty folder: {class_dir.name}")
        continue

    random.shuffle(images)

    total = len(images)

    # Calculate split sizes
    train_end = int(total * TRAIN_RATIO)
    val_end = train_end + int(total * VAL_RATIO)

    train_images = images[:train_end]
    val_images = images[train_end:val_end]
    test_images = images[val_end:]

    # Organize the images
    splits = {
        "train": train_images,
        "val": val_images,
        "test": test_images
    }

    for split_name, split_images in splits.items():

        destination = (
            OUTPUT_DIR / split_name / class_dir.name
        )

        destination.mkdir(parents=True, exist_ok=True)

        for image in split_images:
            shutil.copy2(
                image,
                destination / image.name
            )

    print(
        f"{class_dir.name}: "
        f"Train={len(train_images)}, "
        f"Validation={len(val_images)}, "
        f"Test={len(test_images)}"
    )

    total_images += total

print("\n--------------------------------")
print("DATASET PREPARATION COMPLETED")
print("--------------------------------")

print("Total images:", total_images)
print("Output folder:", OUTPUT_DIR)