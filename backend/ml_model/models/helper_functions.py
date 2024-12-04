import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow import keras


def predict_song_genre(nn_model, song_data):
  with open('scaler.pkl', 'rb') as f:
      scaler = pickle.load(f)

  preprocessed_song = preprocess_song(song_data, scaler)
  predict_top_genres(nn_model, preprocessed_song, label_encoder)

def predict_playlist_genre(nn_model, playlist_data, k=3):
    # Load the pre-fitted scaler
    with open('scaler.pkl', 'rb') as f:
        scaler = pickle.load(f)

    # Aggregate the playlist with preprocessing
    aggregated_playlist = aggregate_playlist(playlist_data, scaler)
    print("Aggregated playlist data:\n")
    print(aggregated_playlist)

    # Run the genre prediction
    predict_top_genres(nn_model, aggregated_playlist, label_encoder, k)

def predict_top_genres(model, song_features, label_encoder, k):

    feature_labels = [
    "track_genre", "key_1", "key_2", "key_3", "key_4", "key_5", "key_6", "key_7", "key_8", "key_9",
    "key_10", "key_11", "meter_1", "meter_3", "meter_4", "meter_5", "popularity", "duration_ms",
    "danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness",
    "valence", "tempo"
    ]

    y_pred_nn = model.predict(song_features)
    top_k_indices = np.argsort(y_pred_nn[0])[::-1][:k]
    top_k_genres = label_encoder.inverse_transform(top_k_indices)

    print("Top k predicted genres:")
    print(top_k_genres)
    return top_k_genres

# this is the important function. Relies on pre loaded scaler * USE THE RIGHT ONE

def preprocess_song(song_data, scaler):

    key_columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    meter_columns = [1, 3, 4, 5]

    song_df = pd.DataFrame([song_data])  # Convert the dictionary to a DataFrame

    song_df = song_df.drop(columns = ['track_id', 'artists', 'album_name', 'track_name'])
    song_df.drop(columns=["track_genre"], inplace=True)  # Drop the genre column

    song_df["explicit"] = song_df["explicit"].map({False: 0, True: 1})

    for col in key_columns:
        song_df[f'key_{col}'] = (song_df['key'] == col).astype(int)
    for col in meter_columns:
        song_df[f'meter_{col}'] = (song_df['time_signature'] == col).astype(int)
    song_df.drop(columns=['key', 'time_signature'], inplace=True)

    song_scaled = scaler.transform(song_df[numeric_cols])  # Use the pre-fitted scaler
    song_scaled_df = pd.DataFrame(song_scaled, columns=numeric_cols)

    song_df.drop(columns=numeric_cols, inplace=True)
    song_df_scaled = pd.concat([song_df.reset_index(drop=True), song_scaled_df], axis=1)

    # Ensure correct column order
    column_order = ['explicit', 'mode'] + [f'key_{col}' for col in key_columns] + [f'meter_{col}' for col in meter_columns] + numeric_cols
    song_df_scaled = song_df_scaled[column_order]

    return song_df_scaled

# playlist predictions

def aggregate_playlist(playlist_data, scaler):
    key_columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    meter_columns = [1, 3, 4, 5]

    numeric_cols = [
        "popularity", "duration_ms", "danceability", "energy", "loudness",
        "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"
    ]
    # pre process each song in playlist
    processed_songs = []
    for song in playlist_data:
        processed_song = preprocess_song(song, scaler)
        processed_songs.append(processed_song)

    playlist_df = pd.concat(processed_songs, ignore_index=True)
    
    aggregated_numeric = playlist_df[numeric_cols].mean()
    dominant_key = playlist_df[[f'key_{col}' for col in key_columns]].mean().idxmax()
    dominant_meter = playlist_df[[f'meter_{col}' for col in meter_columns]].mean().idxmax()
    explicit_mode = playlist_df["explicit"].mode()[0]
    mode_mode = playlist_df["mode"].mode()[0]

    # Dictionary for categorical features
    aggregated_categorical = {
        "explicit": explicit_mode,
        "mode": mode_mode,
        dominant_key: 1,
        dominant_meter: 1,
    }

    # Set non-dominant key and meter values to 0
    for col in [f'key_{k}' for k in key_columns]:
        if col != dominant_key:
            aggregated_categorical[col] = 0
    for col in [f'meter_{m}' for m in meter_columns]:
        if col != dominant_meter:
            aggregated_categorical[col] = 0

    # combine numeric and categorical features
    aggregated_numeric_df = pd.DataFrame([aggregated_numeric])
    aggregated_categorical_df = pd.DataFrame([aggregated_categorical])
    aggregated_playlist = pd.concat([aggregated_categorical_df.reset_index(drop=True), aggregated_numeric_df.reset_index(drop=True)], axis=1)

    # Ensure correct column order
    column_order = ['explicit', 'mode'] + [f'key_{col}' for col in key_columns] + [f'meter_{col}' for col in meter_columns] + numeric_cols
    aggregated_playlist = aggregated_playlist[column_order]

    return aggregated_playlist