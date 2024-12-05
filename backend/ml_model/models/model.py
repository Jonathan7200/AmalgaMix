## CREATE MODEL HERE. MAKE SURE YOU ALSO DUMP THE MODEL INTO A PKL into the correct location
from helper_functions import *
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder

model = joblib.load('model_74.pkl')

predict_playlist_genre(model, playlist_data)