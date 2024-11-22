import axios from 'axios'

const mlService = {
    testConnection: async () => {
        return await axios.get('http://localhost:8000/testfastapi');
    },

    predictGenre: async (songFeatures) => {
        const response = await axios.post('http//localhost:8000/predict', {
            features: songFeatures
        });
        return response.data // This should be where the mlModel returns the genre
    },
};

export default mlService

