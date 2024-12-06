from backend.ml_model.helper_functions import *
import pandas as pd
import numpy as np
import joblib
import pickle
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import joblib


model = joblib.load('model_74.pkl')

# Example playlist data
playlist_data = [
    {
        "track_id": "5SuOikwiRyPMVoIQDJUgSV",
        "artists": "Gen Hoshino",
        "album_name": "Comedy",
        "track_name": "Comedy",
        "popularity": 73,
        "duration_ms": 230666,
        "explicit": False,
        "danceability": 0.676,
        "energy": 0.4610,
        "key": 1,
        "loudness": -6.746,
        "mode": 0,
        "speechiness": 0.1430,
        "acousticness": 0.0322,
        "instrumentalness": 0.000001,
        "liveness": 0.3580,
        "valence": 0.7150,
        "tempo": 87.917,
        "time_signature": 4,
        "track_genre": "acoustic"
    },
    {
        "track_id": "5SuOikwiRyPMVoIQDJUgSV",
        "artists": "Gen Hoshino",
        "album_name": "Comedy",
        "track_name": "Comedy",
        "popularity": 73,
        "duration_ms": 230666,
        "explicit": False,
        "danceability": 0.676,
        "energy": 0.4610,
        "key": 1,
        "loudness": -6.746,
        "mode": 0,
        "speechiness": 0.1430,
        "acousticness": 0.0322,
        "instrumentalness": 0.000001,
        "liveness": 0.3580,
        "valence": 0.7150,
        "tempo": 87.917,
        "time_signature": 4,
        "track_genre": "acoustic"
    }
]

# Predict playlist genre
predict_playlist_genre(model, playlist_data)