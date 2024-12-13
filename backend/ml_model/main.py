from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
import os
import pandas as pd
from typing import List
import joblib

from helper_functions import predict_playlist_genre  # Ensure this function is defined in helper_functions.py

app = FastAPI()

# Allow CORS from React app
origins = [
    "http://localhost:5000",  # Backend
    "http://localhost:3000",  # Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Load the dataset
DATASET_PATH = "data/spotify_tracks.csv"
try:
    df = pd.read_csv(DATASET_PATH, index_col=0)
    print("Dataset loaded successfully.")
except Exception as e:
    print("Error loading dataset:", e)
    df = None

# Define a Pydantic model that matches the structure of each track in "features"
class TrackFeatures(BaseModel):
    track_id: str
    artists: str
    album_name: str
    track_name: str
    popularity: int
    duration_ms: int
    explicit: bool
    danceability: float
    energy: float
    key: int
    loudness: float
    mode: int
    speechiness: float
    acousticness: float
    instrumentalness: float
    liveness: float
    valence: float
    tempo: float
    time_signature: int
    track_genre: str

# Model for incoming "features"
class Features(BaseModel):
    features: List[TrackFeatures]

# Model for incoming genres
class GenresRequest(BaseModel):
    genres: List[str]

# Use startup event handler to load the model
@app.on_event("startup")
def load_model():
    global model
    model_path = os.getenv('MODEL_PATH', 'models/model_74.pkl')
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None  # If model fails to load, set to None

@app.get("/testfastapi")
async def ping():
    return {"message": "FastAPI from ML service"}

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post('/get-songs')
async def get_songs(request: GenresRequest):
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded.")

    genres = request.genres
    if not genres:
        raise HTTPException(status_code=400, detail="Genres must be provided.")

    try:
        results = []
        for genre in genres:
            genre_songs = df[df["track_genre"] == genre]
            if len(genre_songs) == 0:
                continue
            # Sample up to 2 songs for the given genre
            selected_songs = genre_songs.sample(min(2, len(genre_songs))).to_dict(orient="records")
            results.extend(selected_songs)

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(data: Features):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    try:
        print("Received data for prediction:", data.features)

        # Process the input data
        playlist_data = [track.dict() for track in data.features]
        print("Processed playlist data:", playlist_data)

        # Make the prediction
        res = predict_playlist_genre(model, playlist_data)

        print("Model predictions:", res)

        # Ensure res is JSON serializable
        if isinstance(res, np.ndarray):
            res = res.tolist()  # Convert NumPy array to list
        elif not isinstance(res, list):
            res = [str(r) for r in res]  # Ensure it's a list of strings

        return {"genre": list(res)}

    except HTTPException as http_ex:
        print("HTTPException:", http_ex.detail)
        raise http_ex
    except Exception as e:
        print("Error during prediction:", e)
        raise HTTPException(status_code=500, detail=f"Unexpected server error: {str(e)}")
