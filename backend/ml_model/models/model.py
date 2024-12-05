## CREATE MODEL HERE. MAKE SURE YOU ALSO DUMP THE MODEL INTO A PKL into the correct location
from helper_functions import *
import pandas as pd
import numpy as np
import pickle
from keras.models import load_model
from sklearn.preprocessing import LabelEncoder

model = load_model('nn_model_74.h5')

predict_playlist_genre(model, playlist_data)