import express from 'express';
import axios from 'axios';

const router = express.Router();

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

export default router;