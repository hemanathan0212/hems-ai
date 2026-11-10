import torch
import torch.nn as nn

import matplotlib.pyplot as plt

from pathlib import Path
from PIL import Image

from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0


# =====================================
# 1. CONFIGURATION
# =====================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

BASE_DIR = Path(__file__).resolve().parent

TEST_DIR = BASE_DIR / "dataset" / "prepared_dataset" / "test"

MODEL_PATH = BASE_DIR / "models" / "best_soil_model.pth"

OUTPUT_PATH = BASE_DIR / "models" / "misclassified_images.png"

print("Using device:", DEVICE)


# =====================================
# 2. IMAGE TRANSFORMATION
# =====================================

transform = transforms.Compose([

    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )

])


# =====================================
# 3. LOAD TEST DATASET
# =====================================

test_dataset = datasets.ImageFolder(
    TEST_DIR,
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=16,
    shuffle=False,
    num_workers=0
)

class_names = test_dataset.classes

print("Test images:", len(test_dataset))


# =====================================
# 4. LOAD TRAINED MODEL
# =====================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

model = efficientnet_b0(weights=None)

in_features = model.classifier[1].in_features

model.classifier[1] = nn.Linear(
    in_features,
    len(class_names)
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()


# =====================================
# 5. FIND MISCLASSIFIED IMAGES
# =====================================

misclassified = []

correct_count = 0

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(DEVICE)

        outputs = model(images)

        probabilities = torch.softmax(outputs, dim=1)

        confidences, predictions = torch.max(
            probabilities,
            dim=1
        )

        for i in range(len(labels)):

            actual = labels[i].item()

            predicted = predictions[i].item()

            confidence = confidences[i].item()

            image_path = test_dataset.samples[
                len(misclassified) + correct_count
            ][0]

            if actual == predicted:

                correct_count += 1

            else:

                misclassified.append({

                    "path": image_path,

                    "actual": class_names[actual],

                    "predicted": class_names[predicted],

                    "confidence": confidence * 100

                })

print("\n================================")
print("MISCLASSIFICATION SUMMARY")
print("================================")

print("Correct predictions:", correct_count)

print("Incorrect predictions:", len(misclassified))


# =====================================
# 6. PRINT INCORRECT PREDICTIONS
# =====================================

for index, item in enumerate(misclassified):

    print(f"\nImage {index + 1}")

    print("File:", Path(item["path"]).name)

    print("Actual:", item["actual"])

    print("Predicted:", item["predicted"])

    print(f"Confidence: {item['confidence']:.2f}%")


# =====================================
# 7. DISPLAY MISCLASSIFIED IMAGES
# =====================================

if not misclassified:

    print("\nNo misclassified images found!")

else:

    columns = 4

    rows = (len(misclassified) + columns - 1) // columns

    plt.figure(figsize=(16, rows * 4))

    for index, item in enumerate(misclassified):

        image = Image.open(item["path"]).convert("RGB")

        plt.subplot(rows, columns, index + 1)

        plt.imshow(image)

        plt.title(
            f"Actual: {item['actual']}\n"
            f"Predicted: {item['predicted']}\n"
            f"Confidence: {item['confidence']:.1f}%",
            fontsize=9
        )

        plt.axis("off")

    plt.tight_layout()

    plt.savefig(
        OUTPUT_PATH,
        dpi=200,
        bbox_inches="tight"
    )

    print("\nImage report saved at:")

    print(OUTPUT_PATH)

    plt.show()