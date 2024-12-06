import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlaylistInput = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      console.error('Access token is missing');
      window.location.href = '/'; // Redirect to login if no token available
      return;
    }

    const fetchPlaylists = async () => {
      setIsLoadingPlaylists(true);
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Fetched Playlists:', response.data.items);
        setPlaylists(response.data.items || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Failed to fetch playlists. Please try again.');
      } finally {
        setIsLoadingPlaylists(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  useEffect(() => {
    if (selectedPlaylist) {
      const fetchTracks = async () => {
        setIsLoadingTracks(true);
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log('Fetching Tracks from Playlist', response.data.items);
          setTracks(response.data.items || []);
        } catch (error) {
          console.error('Failed to fetch tracks:', error);
          setError('Failed to fetch tracks. Please try again.');
        } finally {
          setIsLoadingTracks(false);
        }
      };

      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [selectedPlaylist, accessToken]);

  const handleSelectionPlaylist = (event) => {
    setSelectedPlaylist(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Extract track IDs from the playlist tracks
      const trackIds = tracks
        .map((trackItem) => trackItem.track?.id) // Use track ID as a string
        .filter((id) => !!id); // Exclude null or undefined values
  
      if (trackIds.length === 0) {
        alert('No valid track IDs found.');
        return;
      }
  
      // Call backend endpoint with track IDs
      const featuresResponse = await axios.get('http://localhost:5000/api/get-tracks-features', {
        params: { ids: trackIds.join(',') },
      });
  
      const localFeatures = featuresResponse.data || [];
  
      const combinedTracks = tracks.map((trackItem) => {
        const track = trackItem.track;
        if (!track) return null;
  
        // Find matching features from the local CSV results
        const features = localFeatures.find((f) => f.id === track.id); // Match as strings
  
        return {
          id: track.id,
          track_name: track.name,
          artist: track.artists[0]?.name || 'Unknown',
          albumb_name: track.album.name,
          popularity: track.popularity,
          duration_ms: track.duration_ms,
          explicit: track.explicit,
          // Use features from local CSV if found, else null or default
          danceability: features?.danceability ?? null,
          energy: features?.energy ?? null,
          key: features?.key ?? null,
          loudness: features?.loudness ?? null,
          mode: features?.mode ?? null,
          speechiness: features?.speechiness ?? null,
          acousticness: features?.acousticness ?? null,
          instrumentalness: features?.instrumentalness ?? null,
          liveness: features?.liveness ?? null,
          valence: features?.valence ?? null,
          tempo: features?.tempo ?? null,
          time_signature: features?.time_signature ?? null,
          track_genre: features?.track_genre ?? 'Unknown',
        };
      }).filter(Boolean); // Remove any null entries
  
      const response = await axios.post('http://localhost:5000/api/submit-playlist', {
        playlistId: selectedPlaylist,
        tracks: combinedTracks,
      });
  
      console.log('Backend Response:', response.data);
      alert('Playlist submitted successfully!');
    } catch (error) {
      console.error('Error submitting playlist:', error);
      alert('Failed to submit playlist. Please try again.');
    }
  };
  

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h3>PICK A PLAYLIST</h3>
      {isLoadingPlaylists ? (
        <p>Loading playlists...</p>
      ) : (
        <div>
          <select value={selectedPlaylist} onChange={handleSelectionPlaylist}>
            <option value="">-- PICK FROM THESE --</option>
            {playlists && playlists.length > 0 ? (
              playlists.map((playlist) => {
                if (!playlist) return null;
                return (
                  <option key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </option>
                );
              })
            ) : (
              <option disabled>No playlists found.</option>
            )}
          </select>
          {selectedPlaylist && (
            <div>
              <h3>Tracks in Playlist</h3>
              {isLoadingTracks ? (
                <p>Loading...</p>
              ) : tracks.length > 0 ? (
                <ul>
                  {tracks.map((trackItem) => {
                    const track = trackItem.track;
                    return track ? <li key={track.id}>{track.name}</li> : null;
                  })}
                </ul>
              ) : (
                <p>No tracks in Playlist</p>
              )}
            </div>
          )}
          <button onClick={handleSubmit} disabled={isLoadingTracks}>
            SEND TO ML MODEL
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistInput;
