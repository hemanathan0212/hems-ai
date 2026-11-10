import torch
import torch.nn as nn

from pathlib import Path
from torchvision import transforms
from torchvision.models import efficientnet_b0
from PIL import Image



# ==================================
# 1. DEVICE CONFIGURATION
# ==================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", DEVICE)


# ==================================
# 2. MODEL PATH
# ==================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "best_soil_model.pth"


# ==================================
# 3. LOAD MODEL CHECKPOINT
# ==================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=True
)

CLASS_NAMES = checkpoint["class_names"]

IMAGE_SIZE = checkpoint["image_size"]


# ==================================
# 4. RECONSTRUCT MODEL
# ==================================

model = efficientnet_b0(weights=None)

in_features = model.classifier[1].in_features

model.classifier[1] = nn.Linear(
    in_features,
    len(CLASS_NAMES)
)


# ==================================
# 5. LOAD TRAINED WEIGHTS
# ==================================

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()

print("Soil classification model loaded!")
print("Classes:", CLASS_NAMES)


# ==================================
# 6. IMAGE PREPROCESSING
# ==================================

transform = transforms.Compose([

    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )

])


# ==================================
# 7. PREDICTION FUNCTION
# ==================================

def predict_soil(image: Image.Image):

    image = image.convert("RGB")

    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0)

    image_tensor = image_tensor.to(DEVICE)

    with torch.inference_mode():

        outputs = model(image_tensor)

        probabilities = torch.softmax(outputs, dim=1)

        confidence, predicted_class = torch.max(
            probabilities, dim=1
        )

    predicted_soil = CLASS_NAMES[predicted_class.item()]

    confidence_score = confidence.item() * 100

    return {
        "predicted_soil": predicted_soil,
        "confidence": round(confidence_score, 2)
    }