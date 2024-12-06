
import spotifyService from '../services/spotifyService.js';
import mlService from '../services/mlService.js';

// Test ML service 

export const submitPlaylist = async (req, res) => {
  const { playlistId, tracks } = req.body;
  console.log(`Playlist being submitted: ${playlistId},`)

  if (!playlistId || !tracks) {
    return res.status(400).json({ error: 'Missing playlist ID or tracks' });
  }

  console.log('Received Playlist ID:', playlistId);
  console.log('Received Tracks:', tracks);

  // (Optional) Process playlist data or forward it to ML service
  res.status(200).json({ message: 'Playlist received successfully!', data: { playlistId, tracks } });
  

};

export const testMLService = async (req, res) => {
  try {
    const response = await mlService.testConnection();
    res.json({
      message: 'Response from ML service',
      data: response.data,
    });
  } catch (error) {
    console.error('Error communicating with ML service:', error);
    res.status(500).json({ error: 'Error communicating with ML service' });
  }
};

// Get song rec
export const getRecommendations = async (req, res) => {
  try {
    const { playlist } = req.body;

    // get song features from Spotify
    const songFeatures = await spotifyService.getSongFeatures(playlist);

    // send features to ML service for genre prediction
    const genrePrediction = await mlService.predictGenre(songFeatures);

    // Get recommendations from Spotify
    const recommendations = await spotifyService.getRecommendations(genrePrediction);

    // Send recommendations to frontend
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
