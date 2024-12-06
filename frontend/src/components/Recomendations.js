import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recommendations = ({ playlistId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!playlistId) return; // No playlist selected

      try {
        const response = await axios.post('http://localhost:5000/api/get-recommendations', { playlistId });
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch recommendations. Please try again.');
      }
    };

    fetchRecommendations();
  }, [playlistId]);

  return (
    <div>
      <h3>Recommended Songs</h3>
      {error ? (
        <p>{error}</p>
      ) : recommendations.length > 0 ? (
        <ul>
          {recommendations.map((song, index) => (
            <li key={index}>
              {song.name} by {song.artist}
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
