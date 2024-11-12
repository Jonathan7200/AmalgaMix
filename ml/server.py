from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
app = FastAPI()

# Load the model once when the app starts
model = load_model('path_to_your_model.h5')

# Allow CORS from React app
origins = [
    "http://localhost:3000",  # React app's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.on_event("startup")
async def load_model_on_startup():
    # Load model when the application starts
    global model
    model = load_model('path_to_your_model.h5')
    print("Model loaded successfully!")

@app.post("/predict/")
async def predict(song_features: SongFeatures):
    # Convert the input data into a format the model can understand
    genre_features_input = np.array(song_features.genre_features).reshape(1, -1)
    lyrics_features_input = np.array(song_features.lyrics_features).reshape(1, -1)
    audio_features_input = np.array(song_features.audio_features).reshape(1, -1)

    # Make the prediction using the model
    prediction = model.predict([genre_features_input, lyrics_features_input, audio_features_input])

    # Assuming prediction is a feature vector, return it as a response
    return {"predicted_features": prediction.tolist()}