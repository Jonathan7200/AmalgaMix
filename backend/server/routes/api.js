import express from 'express';
import axios from 'axios';
import { submitPlaylist, getRecommendations, testMLService } from '../controllers/recommendationController.js';


const router = express.Router();

router.post('/submit-playlist', submitPlaylist);


router.get('/test-ml-service', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8000/testfastapi');
    res.json({
      message: 'Response from ML service',  
      data: response.data,
    });
  } catch (error) {
    console.error('Error communicating with ML service:', error);
    res.status(500).json({ error: 'Error communicating with ML service' });
  }
});

router.post('/get-recommendations', getRecommendations);


export default router;