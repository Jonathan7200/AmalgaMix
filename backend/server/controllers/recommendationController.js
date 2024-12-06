
import datasetServices from '../services/datasetServices.js';
import mlService from '../services/mlService.js';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';
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




export const getTracksFeatures = async (req, res) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: 'Missing ids query parameter' });
    }

    // Convert requested IDs to strings to match `track_id` in the CSV
    const requestedIds = idsParam.split(',').map((id) => id.trim());
    if (requestedIds.length === 0) {
      return res.status(400).json({ error: 'No valid track IDs provided' });
    }

    // Path to the CSV file
    const csvFilePath = path.join(process.cwd(), '..', 'ml_model', 'data', 'spotify_tracks.csv');
    console.log('Resolved CSV file path:', csvFilePath);

    const results = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => {
        // Ensure `track_id` from the CSV matches any of the requested IDs
        if (requestedIds.includes(data.track_id)) {
          results.push({
            id: data.track_id,
            artist: data.artists,
            album_name: data.album_name,
            track_name: data.track_name,
            popularity: parseInt(data.popularity, 10),
            duration_ms: parseInt(data.duration_ms, 10),
            explicit: data.explicit === 'TRUE',
            danceability: parseFloat(data.danceability),
            energy: parseFloat(data.energy),
            key: parseInt(data.key, 10),
            loudness: parseFloat(data.loudness),
            mode: parseInt(data.mode, 10),
            speechiness: parseFloat(data.speechiness),
            acousticness: parseFloat(data.acousticness),
            instrumentalness: parseFloat(data.instrumentalness),
            liveness: parseFloat(data.liveness),
            valence: parseFloat(data.valence),
            tempo: parseFloat(data.tempo),
            time_signature: parseInt(data.time_signature, 10),
            track_genre: data.track_genre,
          });
        }
      })
      .on('end', () => {
        res.status(200).json(results);
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        res.status(500).json({ error: 'Failed to read CSV file' });
      });
  } catch (error) {
    console.error('Error in getTracksFeatures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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

    if (!playlist || !Array.isArray(playlist)) {
      return res.status(400).json({ error: 'Invalid playlist data provided.' });
    }

    // Extract song features
    const songFeatures = playlist.map((song) => ({
      explicit: song.explicit,
      mode: song.mode,
      popularity: song.popularity,
      danceability: song.danceability,
      energy: song.energy,
      loudness: song.loudness,
      speechiness: song.speechiness,
      acousticness: song.acousticness,
      instrumentalness: song.instrumentalness,
      liveness: song.liveness,
      valence: song.valence,
      tempo: song.tempo,
      duration_ms: song.duration_ms,
      key: `key_${song.key}`,
      meter: `meter_${song.time_signature}`,
    }));

    // Send features to the ML service for genre prediction
    const genrePrediction = await mlService.predictGenre(songFeatures);

    // Use the predicted genre to get recommendations from Spotify
    const recommendations = await datasetServices.getRecommendations(genrePrediction.genre);

    // Send recommendations back to the frontend
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error.message);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};
// Meant to test the abilities of getRecommendation, excluding predictGenre and getSongFeatures
export const testRecommendations = async (req, res) => {
  try {
    const { genres } = req.body;

    if (!genres || !Array.isArray(genres)) {
      return res.status(400).json({ error: "Genres must be provided as an array." });
    }

    // Call the datasetServices to get recommendations from FastAPI
    const recommendations = await datasetServices.getRecommendations(genres);

    // Send the recommendations back to the client
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};
