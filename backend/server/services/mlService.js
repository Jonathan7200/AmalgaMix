import axios from 'axios'



const mlService = {
  predictGenre: async (songFeatures) => {
    try {
      console.log('Sending features to ML service:', songFeatures);
      const response = await axios.post('http://localhost:8000/predict', {
        features: songFeatures,
      });
      console.log('ML Service Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in predictGenre:', error.response?.data || error.message);
      throw new Error('Failed to predict genre');
    }
  },
};

export default mlService;
