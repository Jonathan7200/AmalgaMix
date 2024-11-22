## CREATE MODEL HERE. MAKE SURE YOU ALSO DUMP THE MODEL INTO A PKL into the correct location
import pickle

model = 'placeholder'



with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
    print("Model saved")