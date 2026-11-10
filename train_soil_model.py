import torch
import torch.nn as nn
import torch.optim as optim

from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights

from pathlib import Path


# ==========================================
# 1. DEVICE CONFIGURATION
# ==========================================

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using device:", DEVICE)

if DEVICE.type == "cuda":
    print("GPU:", torch.cuda.get_device_name(0))


# ==========================================
# 2. PROJECT PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "dataset" / "prepared_dataset"

TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "val"

MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)


# ==========================================
# 3. TRAINING CONFIGURATION
# ==========================================

IMAGE_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 15
LEARNING_RATE = 0.0001

NUM_WORKERS = 0


# ==========================================
# 4. IMAGE TRANSFORMATIONS
# ==========================================

train_transforms = transforms.Compose([

    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.RandomHorizontalFlip(),

    transforms.RandomRotation(15),

    transforms.ColorJitter(
        brightness=0.2,
        contrast=0.2,
        saturation=0.2
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


val_transforms = transforms.Compose([

    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# 5. LOAD DATASET
# ==========================================

train_dataset = datasets.ImageFolder(
    TRAIN_DIR,
    transform=train_transforms
)

val_dataset = datasets.ImageFolder(
    VAL_DIR,
    transform=val_transforms
)

class_names = train_dataset.classes

num_classes = len(class_names)

print("\nSoil Categories:")

for name in class_names:
    print(name)

print("\nNumber of classes:", num_classes)

if train_dataset.classes != val_dataset.classes:
    raise ValueError("Training and validation classes do not match!")


# ==========================================
# 6. DATA LOADERS
# ==========================================

train_loader = DataLoader(
    train_dataset,
    batch_size=BATCH_SIZE,
    shuffle=True,
    num_workers=NUM_WORKERS,
    pin_memory=(DEVICE.type == "cuda")
)

val_loader = DataLoader(
    val_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=NUM_WORKERS,
    pin_memory=(DEVICE.type == "cuda")
)


# ==========================================
# 7. CLASS WEIGHTS
# ==========================================

class_counts = torch.bincount(
    torch.tensor(train_dataset.targets),
    minlength=num_classes
).float()

class_weights = len(train_dataset) / (
    num_classes * class_counts
)

class_weights = class_weights.to(DEVICE)

print("\nClass weights:")

for name, weight in zip(class_names, class_weights):
    print(f"{name}: {weight.item():.4f}")


# ==========================================
# 8. LOAD EFFICIENTNETB0
# ==========================================

print("\nLoading pretrained EfficientNetB0...")

weights = EfficientNet_B0_Weights.DEFAULT

model = efficientnet_b0(weights=weights)

# Replace final classification layer

in_features = model.classifier[1].in_features

model.classifier[1] = nn.Linear(
    in_features,
    num_classes
)

model = model.to(DEVICE)


# ==========================================
# 9. LOSS AND OPTIMIZER
# ==========================================

criterion = nn.CrossEntropyLoss(
    weight=class_weights
)

optimizer = optim.Adam(
    model.parameters(),
    lr=LEARNING_RATE
)

scaler = torch.amp.GradScaler(
    "cuda",
    enabled=(DEVICE.type == "cuda")
)


# ==========================================
# 10. TRAINING AND VALIDATION
# ==========================================

best_val_accuracy = 0.0

for epoch in range(EPOCHS):

    print(f"\nEpoch [{epoch + 1}/{EPOCHS}]")

    # --------------------------
    # Training
    # --------------------------

    model.train()

    train_loss = 0.0
    train_correct = 0
    train_total = 0

    for images, labels in train_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        optimizer.zero_grad(set_to_none=True)

        with torch.amp.autocast(
            "cuda",
            enabled=(DEVICE.type == "cuda")
        ):

            outputs = model(images)

            loss = criterion(outputs, labels)

        scaler.scale(loss).backward()

        scaler.step(optimizer)

        scaler.update()

        train_loss += loss.item() * images.size(0)

        _, predicted = torch.max(outputs, 1)

        train_total += labels.size(0)

        train_correct += (
            predicted == labels
        ).sum().item()

    train_accuracy = 100 * train_correct / train_total

    train_loss = train_loss / train_total

    # --------------------------
    # Validation
    # --------------------------

    model.eval()

    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            with torch.amp.autocast(
                "cuda",
                enabled=(DEVICE.type == "cuda")
            ):

                outputs = model(images)

                loss = criterion(outputs, labels)

            val_loss += loss.item() * images.size(0)

            _, predicted = torch.max(outputs, 1)

            val_total += labels.size(0)

            val_correct += (
                predicted == labels
            ).sum().item()

    val_accuracy = 100 * val_correct / val_total

    val_loss = val_loss / val_total

    # --------------------------
    # Print results
    # --------------------------

    print(f"Training Loss: {train_loss:.4f}")
    print(f"Training Accuracy: {train_accuracy:.2f}%")

    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_accuracy:.2f}%")

    # --------------------------
    # Save best model
    # --------------------------

    if val_accuracy > best_val_accuracy:

        best_val_accuracy = val_accuracy

        torch.save(
            {
                "model_state_dict": model.state_dict(),
                "class_names": class_names,
                "image_size": IMAGE_SIZE,
                "best_val_accuracy": best_val_accuracy
            },
            MODEL_DIR / "best_soil_model.pth"
        )

        print("Best model saved!")


# ==========================================
# 11. TRAINING COMPLETED
# ==========================================

print("\n================================")
print("TRAINING COMPLETED")
print("================================")

print(
    f"Best Validation Accuracy: "
    f"{best_val_accuracy:.2f}%"
)

print(
    "Model saved at:",
    MODEL_DIR / "best_soil_model.pth"
)