import hashlib
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "dataset" / "prepared_dataset"

SPLITS = ["train", "val", "test"]

IMAGE_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp", ".bmp"
}

hash_groups = defaultdict(list)

for split in SPLITS:

    split_dir = DATA_DIR / split

    for image_path in split_dir.rglob("*"):

        if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue

        file_hash = hashlib.sha256(
            image_path.read_bytes()
        ).hexdigest()

        hash_groups[file_hash].append(
            (split, image_path)
        )


print("\nDATA LEAKAGE ANALYSIS")
print("==============================")

leakage_count = 0

for file_hash, records in hash_groups.items():

    splits_found = set(
        record[0] for record in records
    )

    if len(splits_found) > 1:

        leakage_count += 1

        print("\nDuplicate found across splits:")

        for split, path in records:
            print(split, "->", path.name)


print("\n==============================")

if leakage_count == 0:

    print("No cross-split exact duplicates found!")

else:

    print("Cross-split duplicate groups:", leakage_count)

print("==============================")