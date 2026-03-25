from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from pathlib import Path
from typing import Dict, List
import random

app = FastAPI(title="Car Detection Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load car database
def load_cars():
    try:
        with open("../data/cars.json", "r") as f:
            return json.load(f)
    except:
        return []

cars_db = load_cars()

# Mock car detection database
# In a real application, this would use a trained ML model
KNOWN_CARS = [
    {
        "carId": "lamborghini_aventador_2012",
        "confidence": 0.95,
        "make": "Lamborghini",
        "model": "Aventador",
        "year": 2012,
        "keywords": ["aventador", "lamborghini", "yellow", "gold"],
    },
    {
        "carId": "nissan_skyline_r34",
        "confidence": 0.88,
        "make": "Nissan",
        "model": "Skyline GT-R",
        "year": 1999,
        "keywords": ["skyline", "r34", "nissan", "blue"],
    },
    {
        "carId": "porsche_911_997",
        "confidence": 0.85,
        "make": "Porsche",
        "model": "911",
        "year": 2009,
        "keywords": ["porsche", "911", "orange", "carrera"],
    },
    {
        "carId": "ferrari_f430",
        "confidence": 0.90,
        "make": "Ferrari",
        "model": "F430",
        "year": 2005,
        "keywords": ["ferrari", "f430", "red", "prancing horse"],
    },
    {
        "carId": "bugatti_chiron",
        "confidence": 0.92,
        "make": "Bugatti",
        "model": "Chiron",
        "year": 2016,
        "keywords": ["bugatti", "chiron", "black", "hypercar"],
    },
]


def detect_car_from_image(image_data: bytes) -> Dict:
    """
    Detect car from image.
    In production, this would use OpenCV + ML model for actual detection.
    For demo, returns a random car detection.
    """
    try:
        # Validate image data exists
        if not image_data or len(image_data) == 0:
            return KNOWN_CARS[0]  # Default to Lamborghini
        
        # Simple mock: return random car from known cars
        # In production, this would analyze the image and identify the actual car
        detected_car = random.choice(KNOWN_CARS)
        return detected_car

    except Exception as e:
        # Return default on error
        print(f"Detection error: {e}")
        return KNOWN_CARS[0]


@app.post("/detect")
async def detect_car(file: UploadFile = File(...)):
    """
    Detect car from uploaded image.
    """
    try:
        # Read file
        contents = await file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        # Validate file size (max 10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=413, detail="File too large")

        # Detect car
        detection = detect_car_from_image(contents)

        return {
            "success": True,
            "data": detection,
            "error": None,
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "status": "OK",
        "service": "Car Detection Service",
        "timestamp": str(Path.cwd()),
    }


@app.get("/cars")
async def get_all_cars():
    """Get all available cars."""
    return {
        "success": True,
        "data": cars_db,
        "error": None,
    }


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=True,
    )
