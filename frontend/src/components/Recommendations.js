import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles.css"

const Recommendations = ({ playlistId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!playlistId) return; // No playlist selected

      try {
        const response = await axios.post('http://localhost:5000/api/test-recommendations', { playlistId });
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch recommendations. Please try again.');
      }
    };

    fetchRecommendations();
  }, [playlistId]);
/*
  useEffect(() => {
    // Hardcoded recommendations data
    const hardcodedRecommendations = [
      {
        "track_id": "27spr4gOJgvyiGia9WYeKV",
        "artists": "Foreigner",
        "album_name": "Timeless Rock Hits",
        "track_name": "Hot Blooded",
        "popularity": 1,
        "duration_ms": 184906,
        "explicit": false,
        "danceability": 0.681,
        "energy": 0.664,
        "key": 0,
        "loudness": -8.036,
        "mode": 1,
        "speechiness": 0.0922,
        "acousticness": 0.299,
        "instrumentalness": 0,
        "liveness": 0.0772,
        "valence": 0.729,
        "tempo": 118.33,
        "time_signature": 4,
        "track_genre": "rock"
      },
      {
        "track_id": "5MAK1nd8R6PWnle1Q1WJvh",
        "artists": "Everybody Loves an Outlaw",
        "album_name": "I See Red",
        "track_name": "I See Red",
        "popularity": 76,
        "duration_ms": 230613,
        "explicit": false,
        "danceability": 0.509,
        "energy": 0.448,
        "key": 4,
        "loudness": -7.552,
        "mode": 0,
        "speechiness": 0.0357,
        "acousticness": 0.00713,
        "instrumentalness": 0.0137,
        "liveness": 0.244,
        "valence": 0.221,
        "tempo": 156.909,
        "time_signature": 3,
        "track_genre": "rock"
      }
    ];

    // Simulate fetching hardcoded recommendations (this mimics what the API response would look like)
    setRecommendations(hardcodedRecommendations);
  }, [playlistId]);*/

  return (
    <div>
      <h3>Recommended Songs</h3>
      {error ? (
        <p>{error}</p>
      ) : recommendations.length > 0 ? (
        <ul>
          {recommendations.map((song, index) => (
            <li key={index}>
              Track: {song.track_name} - Album: {song.album_name} by {song.artists}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available yet.</p>
      )}
    </div>
  );
};

export default Recommendations;

