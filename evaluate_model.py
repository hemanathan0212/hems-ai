import torch
import torch.nn as nn

import matplotlib.pyplot as plt

from pathlib import Path
from torch.utils.data import DataLoader

from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)


# =====================================
# 1. DEVICE
# =====================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Device:", DEVICE)


# =====================================
# 2. PATHS
# =====================================

BASE_DIR = Path(__file__).resolve().parent

TEST_DIR = BASE_DIR / "dataset" / "prepared_dataset" / "test"

MODEL_PATH = BASE_DIR / "models" / "best_soil_model.pth"


# =====================================
# 3. IMAGE TRANSFORMATION
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
# 4. LOAD TEST DATASET
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

print("\nTest images:", len(test_dataset))
print("Soil categories:", class_names)


# =====================================
# 5. LOAD TRAINED MODEL
# =====================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

saved_classes = checkpoint["class_names"]

if class_names != saved_classes:
    raise ValueError("Test classes do not match model classes!")

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

print("\nBest validation accuracy:",
      checkpoint["best_val_accuracy"])


# =====================================
# 6. PREDICTIONS
# =====================================

all_predictions = []
all_labels = []

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(DEVICE)

        outputs = model(images)

        predictions = torch.argmax(
            outputs,
            dim=1
        )

        all_predictions.extend(
            predictions.cpu().numpy()
        )

        all_labels.extend(
            labels.numpy()
        )


# =====================================
# 7. ACCURACY
# =====================================

accuracy = accuracy_score(
    all_labels,
    all_predictions
)

print("\n================================")
print("MODEL TEST RESULTS")
print("================================")

print(f"Test Accuracy: {accuracy * 100:.2f}%")


# =====================================
# 8. CLASSIFICATION REPORT
# =====================================

print("\nCLASSIFICATION REPORT\n")

report = classification_report(
    all_labels,
    all_predictions,
    target_names=class_names,
    zero_division=0
)

print(report)


# =====================================
# 9. CONFUSION MATRIX
# =====================================

cm = confusion_matrix(
    all_labels,
    all_predictions
)

display = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=class_names
)

display.plot(
    cmap="Greens",
    xticks_rotation=45
)

plt.title("EfficientNetB0 - Soil Classification")

plt.tight_layout()

plt.savefig(
    BASE_DIR / "models" / "confusion_matrix.png",
    dpi=300
)

plt.show()


print("\nConfusion matrix saved successfully!")