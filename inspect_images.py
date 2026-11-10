import os
from pathlib import Path

dataset_path = (
    Path(__file__).resolve().parent
    / "soil_images"
    / "Soil-Classification-Dataset-main"
    / "Orignal-Dataset"
)

total_images = 0

print("\nSOIL IMAGE DATASET ANALYSIS\n")

if not dataset_path.is_dir():
    raise FileNotFoundError(f"Dataset folder not found: {dataset_path}")

for soil_type in os.listdir(dataset_path):

    folder_path = os.path.join(dataset_path, soil_type)

    if os.path.isdir(folder_path):

        images = os.listdir(folder_path)

        image_count = 0

        for image in images:

            if image.lower().endswith((".jpg", ".jpeg", ".png")):
                image_count += 1

        total_images += image_count

        print(soil_type, ":", image_count, "images")

print("\nTotal Images:", total_images)