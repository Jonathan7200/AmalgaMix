import axios from 'axios'

const mlService = {
    testConnection: async () => {
        return await axios.get('http://localhost:8000/testfastapi');
    },

    predictGenre: async (songFeatures) => {
        try {
          const response = await axios.post('http://localhost:8000/predict', {
            features: songFeatures, // Send song features to the ML service
          });
          return response.data; // Return the genre prediction from the backend
        } catch (error) {
          console.error('Error in predictGenre:', error.message);
          throw new Error('Failed to predict genre');
        }
      },
};

export default mlService

