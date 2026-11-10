from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

DATASET_DIR = BASE_DIR / "dataset" / "prepared_dataset"

print("CHECKING PREPARED DATASET\n")

for split in ["train", "val", "test"]:

    split_dir = DATASET_DIR / split

    print(f"\n{split.upper()}")

    if not split_dir.exists():
        print("Folder not found!")
        continue

    total = 0

    for class_dir in sorted(split_dir.iterdir()):

        if class_dir.is_dir():

            count = len([
                f for f in class_dir.iterdir()
                if f.suffix.lower() in [".jpg", ".jpeg", ".png"]
            ])

            print(f"{class_dir.name}: {count}")
            total += count

    print("Total:", total)