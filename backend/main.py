from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image, UnidentifiedImageError
from io import BytesIO

import csv
from pathlib import Path
from collections import Counter

from pydantic import BaseModel, Field

from model import predict_soil


# ==========================================
# 1. CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Hem's AI API",
    description="AI-Powered Soil Analysis and Fertilizer Recommendation System",
    version="1.0.0"
)


# ==========================================
# 2. CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://hems-ai-36th.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 3. DATASET PATH
# ==========================================

CSV_PATH = (
    Path(__file__).resolve().parent.parent
    / "dataset"
    / "fertilizer_cleaned.csv"
)


# ==========================================
# 4. NPK INPUT VALIDATION
# ==========================================

class SoilDetails(BaseModel):

    nitrogen: float = Field(ge=0)
    phosphorus: float = Field(ge=0)
    potassium: float = Field(ge=0)

    moisture: float = Field(ge=0, le=100)
    temperature: float
    humidity: float = Field(ge=0, le=100)

    crop: str


# ==========================================
# 5. HOME ENDPOINT
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Welcome to Hem's AI Backend!",
        "status": "Running"
    }


# ==========================================
# 6. HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }


# ==========================================
# 7. SOIL IMAGE PREDICTION
# ==========================================

@app.post("/predict-soil")
def soil_prediction(file: UploadFile = File(...)):

    try:

        contents = file.file.read()

        if len(contents) > 10 * 1024 * 1024:

            raise HTTPException(
                status_code=413,
                detail="Image size must be below 10 MB."
            )

        image = Image.open(BytesIO(contents))
        image = image.convert("RGB")

        result = predict_soil(image)

        return {
            "success": True,
            "filename": file.filename,
            "predicted_soil": result["predicted_soil"],
            "confidence": result["confidence"]
        }

    except UnidentifiedImageError:

        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )

    finally:

        file.file.close()


# ==========================================
# 8. FERTILIZER RECOMMENDATION
# ==========================================

@app.post("/recommend-fertilizer")
def recommend_fertilizer(details: SoilDetails):

    # Check dataset availability

    if not CSV_PATH.exists():

        raise HTTPException(
            status_code=500,
            detail=f"Fertilizer dataset not found at: {CSV_PATH}"
        )

    # Read CSV dataset

    try:

        with open(
            CSV_PATH,
            "r",
            newline="",
            encoding="utf-8"
        ) as file:

            rows = list(csv.DictReader(file))

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Unable to read fertilizer dataset: {error}"
        )

    if not rows:

        raise HTTPException(
            status_code=500,
            detail="Fertilizer dataset is empty."
        )

    # User input values

    user_values = {

        "Nitrogen": details.nitrogen,
        "Phosphorus": details.phosphorus,
        "Potassium": details.potassium,
        "Moisture": details.moisture,
        "Temperature": details.temperature,
        "Humidity": details.humidity,

    }

    # Calculate feature ranges

    feature_ranges = {}

    try:

        for feature in user_values:

            values = [
                float(row[feature])
                for row in rows
            ]

            feature_ranges[feature] = max(
                max(values) - min(values),
                1
            )

    except (KeyError, ValueError) as error:

        raise HTTPException(
            status_code=500,
            detail=f"Invalid fertilizer dataset columns or values: {error}"
        )

    # Compare dataset records

    scored_rows = []

    try:

        for row in rows:

            distance = 0

            for feature, user_value in user_values.items():

                dataset_value = float(row[feature])

                difference = (
                    user_value - dataset_value
                ) / feature_ranges[feature]

                distance += difference ** 2

            crop_matches = (
                row["Crop Type"].strip().lower()
                == details.crop.strip().lower()
            )

            scored_rows.append({

                "distance": distance,

                "crop_match": crop_matches,

                "fertilizer": row["Fertilizer Name"],

                "crop": row["Crop Type"],

            })

    except (KeyError, ValueError) as error:

        raise HTTPException(
            status_code=500,
            detail=f"Invalid dataset record: {error}"
        )

    # Filter records by selected crop

    same_crop_rows = [
        row for row in scored_rows
        if row["crop_match"]
    ]

    if not same_crop_rows:

        raise HTTPException(
            status_code=404,
            detail=f"No fertilizer dataset records found for crop: {details.crop}"
        )

    # Sort by similarity distance

    same_crop_rows.sort(
        key=lambda row: row["distance"]
    )

    # Select five nearest records

    nearest_rows = same_crop_rows[:5]

    # Find most common fertilizer

    fertilizer_counts = Counter(
        row["fertilizer"]
        for row in nearest_rows
    )

    recommended_fertilizer = (
        fertilizer_counts.most_common(1)[0][0]
    )

    # Return recommendation

    return {

        "success": True,

        "crop": details.crop,

        "recommended_fertilizer": recommended_fertilizer,

        "similar_records": len(nearest_rows),

        "matching_crop_records": len(same_crop_rows),

        "message": (
            "This is an experimental suggestion based on "
            "similar records in the supplied dataset. "
            "It is not a verified fertilizer dosage recommendation. "
            "Consult a soil test report and local agricultural guidance."
        ),

    }
