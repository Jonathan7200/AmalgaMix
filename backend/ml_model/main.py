from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
import os
import pandas as pd

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
    allow_methods=["*"],  # Allow HTTP methods
    allow_headers=["*"],  # Allow headers
)

# Load the dataset
DATASET_PATH = "data/spotify_tracks.csv"
try:
    df = pd.read_csv(DATASET_PATH, index_col=0)
    print("Dataset loaded successfully.")
except Exception as e:
    print("Error loading dataset:", e)
    df = None

##MIGHT NEED TO CHANGE THIS TO USE THE LIFESPAN EVENT HANDLER 
## for now this works tho so hehe 
@app.on_event("startup")
def load_model():
    global model
    model_path = os.getenv('MODEL_PATH', 'models/model.pkl')
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully.")
    except Exception as e:
        print("Error loading model")

#defines model for incoming requests
class Features(BaseModel):
    features: list

#defines model for incoming genre requests
class GenresRequest(BaseModel):
    genres: list

# Test endpoint to verify FastAPI is running
@app.get("/testfastapi")
async def ping():
    return {"message": "FastAPI from ML service"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Set up get songs post request 
@app.post('/get-songs')
async def get_songs(request: GenresRequest):
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded.")

    genres = request.genres
    if not genres:
        raise HTTPException(status_code=400, detail="Genres must be provided.")

    try:
        # Filter dataset by genres
        results = []
        for genre in genres:
            genre_songs = df[df["track_genre"] == genre]
            selected_songs = genre_songs.sample(min(2, len(genre_songs))).to_dict(orient="records")
            results.extend(selected_songs)

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(data: Features):
    #TESTING IF POST WORKING, COMMENT OUT, The second part should maybe work??
    test_prediction = data.features
    return {"genre": test_prediction}

    #TO TEST RUN copy and paste:
    #Invoke-RestMethod -Uri http://localhost:8000/predict `  -Method POST ` -ContentType "application/json" ` -Body '{"features": [0.0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}'


    # try:
        
    #     #ADD a way to convert features herre into an array of some sort 
    #     input_features = np.array([data.features])  ## ADD HERE
    #     prediction = model.predict(input_features)
    #     predicted_genre = prediction[0] #MAKE SURE GENRE IS IN FIRST SPOT
    #     return {"Predicted Genre": predicted_genre}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    


    


