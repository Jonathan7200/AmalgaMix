import express from 'express';
import cors from 'cors';
import services from './services.js';
import axios from 'axios';
import 'dotenv/config';

services.connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.get('/colab', (req, res) => {
    res.json({ message: 'colab calls will go here' });
});

// Define an API endpoint that interacts with FastAPI server
app.post('/get-recommendation', async (req, res) => {
    try {
        // Send the song features data to FastAPI server for inference
        const response = await axios.post('http://localhost:8000/predict', {
            features: req.body.features  // Pass features from React frontend
        });

        // Send back the prediction to the client (React)
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
});
