import random
import hashlib
import csv

from pathlib import Path
from PIL import Image, ImageDraw

# =====================================
# 1. CONFIGURATION
# =====================================

BASE_DIR = Path(__file__).resolve().parent

POSSIBLE_NAMES = [
    "Original-Dataset",
    "Orignal-Dataset"
]

matches = []

for folder_name in POSSIBLE_NAMES:
    matches.extend(BASE_DIR.rglob(folder_name))

if not matches:
    raise FileNotFoundError("Original soil dataset not found!")

SOURCE_DIR = matches[0]

OUTPUT_DIR = BASE_DIR / "dataset_audit"

CONTACT_DIR = OUTPUT_DIR / "contact_sheets"

CONTACT_DIR.mkdir(parents=True, exist_ok=True)

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".bmp", ".webp"
}

SAMPLES_PER_CLASS = 8

random.seed(42)

print("DATASET AUDIT STARTED")
print("Source:", SOURCE_DIR)


# =====================================
# 2. INITIALIZE REPORTS
# =====================================

image_records = []
hash_records = {}

total_images = 0
corrupted_images = 0


# =====================================
# 3. INSPECT EACH CLASS
# =====================================

for class_dir in sorted(SOURCE_DIR.iterdir()):

    if not class_dir.is_dir():
        continue

    print(f"\nInspecting: {class_dir.name}")

    images = [
        file for file in class_dir.iterdir()
        if file.suffix.lower() in IMAGE_EXTENSIONS
    ]

    class_valid_images = []

    for image_path in images:

        total_images += 1

        try:

            with Image.open(image_path) as img:

                img.verify()

            with Image.open(image_path) as img:

                width, height = img.size

                image_format = img.format

            image_hash = hashlib.sha256(
                image_path.read_bytes()
            ).hexdigest()

            record = {
                "class": class_dir.name,
                "filename": image_path.name,
                "width": width,
                "height": height,
                "format": image_format,
                "hash": image_hash,
                "path": str(image_path)
            }

            image_records.append(record)

            class_valid_images.append(image_path)

            hash_records.setdefault(
                image_hash, []
            ).append(record)

        except Exception as error:

            corrupted_images += 1

            print(
                f"Corrupted image: {image_path.name}"
            )

    print("Total images:", len(images))
    print("Valid images:", len(class_valid_images))

    # =================================
    # 4. GENERATE CONTACT SHEET
    # =================================

    random.shuffle(class_valid_images)

    selected_images = class_valid_images[
        :SAMPLES_PER_CLASS
    ]

    thumb_width = 240
    thumb_height = 180
    label_height = 35

    columns = 4
    rows = (len(selected_images) + columns - 1) // columns

    sheet = Image.new(
        "RGB",
        (
            columns * thumb_width,
            rows * (thumb_height + label_height)
        ),
        "white"
    )

    draw = ImageDraw.Draw(sheet)

    for index, image_path in enumerate(selected_images):

        with Image.open(image_path) as img:

            img = img.convert("RGB")

            img.thumbnail(
                (thumb_width - 10, thumb_height - 10)
            )

            x = (index % columns) * thumb_width

            y = (index // columns) * (
                thumb_height + label_height
            )

            paste_x = x + (
                thumb_width - img.width
            ) // 2

            paste_y = y + (
                thumb_height - img.height
            ) // 2

            sheet.paste(
                img,
                (paste_x, paste_y)
            )

            draw.text(
                (x + 5, y + thumb_height),
                image_path.name,
                fill="black"
            )

    sheet.save(
        CONTACT_DIR / f"{class_dir.name}.jpg"
    )


# =====================================
# 5. DUPLICATE DETECTION
# =====================================

duplicates = {
    image_hash: records
    for image_hash, records in hash_records.items()
    if len(records) > 1
}

print("\n================================")
print("DUPLICATE IMAGE REPORT")
print("================================")

print("Duplicate groups:", len(duplicates))

for records in duplicates.values():

    print("\nDuplicate files:")

    for record in records:

        print(
            record["class"],
            record["filename"]
        )


# =====================================
# 6. SAVE IMAGE DETAILS
# =====================================

with open(
    OUTPUT_DIR / "image_report.csv",
    "w",
    newline="",
    encoding="utf-8"
) as file:

    writer = csv.writer(file)

    writer.writerow([
        "Class",
        "Filename",
        "Width",
        "Height",
        "Format"
    ])

    for record in image_records:

        writer.writerow([
            record["class"],
            record["filename"],
            record["width"],
            record["height"],
            record["format"]
        ])


# =====================================
# 7. SAVE AUDIT SUMMARY
# =====================================

print("\n================================")
print("FINAL DATASET AUDIT")
print("================================")

print("Total images:", total_images)

print("Valid images:", len(image_records))

print("Corrupted images:", corrupted_images)

print("Duplicate groups:", len(duplicates))

print(
    "\nContact sheets:",
    CONTACT_DIR
)

print(
    "\nImage report:",
    OUTPUT_DIR / "image_report.csv"
)

print("\nDATASET AUDIT COMPLETED!")