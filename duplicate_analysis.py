import hashlib
from pathlib import Path
from collections import defaultdict, Counter

BASE_DIR = Path(__file__).resolve().parent

SOURCE_DIR = BASE_DIR / "soil_images" / "Soil-Classification-Dataset-main" / "Orignal-Dataset"

EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

hash_groups = defaultdict(list)

extension_counts = Counter()

total = 0

for class_dir in sorted(SOURCE_DIR.iterdir()):

    if not class_dir.is_dir():
        continue

    for image_path in class_dir.iterdir():

        if image_path.suffix.lower() not in EXTENSIONS:
            continue

        total += 1

        extension_counts[image_path.suffix.lower()] += 1

        file_hash = hashlib.sha256(
            image_path.read_bytes()
        ).hexdigest()

        hash_groups[file_hash].append(
            (class_dir.name, image_path.name)
        )


# Find duplicates
duplicates = {
    key: value
    for key, value in hash_groups.items()
    if len(value) > 1
}

same_class = 0
cross_class = 0

print("\nDUPLICATE ANALYSIS")
print("==============================")

for group_number, files in enumerate(duplicates.values(), 1):

    classes = set(item[0] for item in files)

    print(f"\nGroup {group_number}")

    for class_name, filename in files:
        print(f"{class_name} -> {filename}")

    if len(classes) > 1:
        cross_class += 1
    else:
        same_class += 1


print("\n==============================")
print("FINAL SUMMARY")
print("==============================")

print("Total images:", total)

print("Image formats:", dict(extension_counts))

print("Duplicate groups:", len(duplicates))

print("Duplicates within same class:", same_class)

print("Duplicates across different classes:", cross_class)

print("Unique images:", len(hash_groups))