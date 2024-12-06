import express from 'express';
import axios from 'axios';
import { submitPlaylist, getRecommendations, testRecommendations, getTracksFeatures  } from '../controllers/recommendationController.js';


const router = express.Router();

router.post('/submit-playlist', submitPlaylist);

router.get('/get-tracks-features', getTracksFeatures);


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

router.get('/get-recommendations', getRecommendations);
router.post('/get-recommendations', getRecommendations);

router.get('/test-recommendations', testRecommendations);

router.post('/test-recommendations', testRecommendations);

export default router;