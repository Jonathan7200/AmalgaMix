import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Recommendations from './Recomendations';

const PlaylistInput = ({ accessToken }) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const[tracks, setTracks] = useState([]);
  const[selectedTracks, setSelectedTracks] = useState(null);



  const [error, setError] = useState(null);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);


  useEffect(() => {
    if (!accessToken) {
      console.error('Access token is missing');
      window.location.href = '/'; // Redirect to login if no token available
      return;
    }
    console.log('Access Token:', accessToken);

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
      } 
      catch (error) {
        console.error('Error fetching playlists:', error);
        setError('Failed to fetch playlists. Please try again.');
      } 
      finally {
        setIsLoadingPlaylists(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  useEffect(() => {
    if (selectedPlaylist){
        const fetchTracks = async()=>{
            setIsLoadingTracks(true);
            try{
                const response = await axios.get(
                  
                    `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
                        headers: {
                        Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    console.log('Fetching Tracks from Playlist', response.data.items);
                    setTracks(response.data.items || []);

            }
            catch(error){
                console.error("failed to fetch tracks")
                setError('Failed to fetch playlists. Please try again.');
            }
            finally {
                setIsLoadingTracks(false)
            }
        };
        
        fetchTracks();
        }
        else {
            setTracks([]);}

    } , [selectedPlaylist, accessToken] );




//Was using this no longer needed but just incase
//   const handleSelectionChange = (event) => {
//     setSelectedPlaylist(event.target.value);
//   };

const handleSelectionPlaylist = (event) => {
  setSelectedPlaylist(event.target.value);
};

const handleSubmit = async () => {
  try {
    console.log('Submitting playlist:', selectedPlaylist);

    await axios.post('http://localhost:5000/api/submit-playlist', {
      playlistId: selectedPlaylist,
      tracks: tracks.map((trackItem) => ({
        id: trackItem.track.id,
        name: trackItem.track.name,
        artist: trackItem.track.artists[0]?.name || 'Unknown',
      })),
    });

    alert('Playlist submitted successfully!');
  } catch (error) {
    console.error('Error submitting playlist:', error);
    setError('Failed to submit playlist. Please try again.');
  }
};

return (
  <div>
    <h3>PICK A PLAYLIST</h3>
    {isLoadingPlaylists ? (
      <p>Loading playlists...</p>
    ) : (
      <div>
        <select value={selectedPlaylist} onChange={handleSelectionPlaylist}>
          <option value="">-- PICK FROM THESE --</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
        {selectedPlaylist && (
          <div>
            <h3>Tracks in Playlist</h3>
            {isLoadingTracks ? (
              <p>Loading...</p>
            ) : (
              tracks.map((track) => <p key={track.track.id}>{track.track.name}</p>)
            )}
            <button onClick={handleSubmit} disabled={isLoadingTracks}>
              SEND TO ML MODEL
            </button>
            {/* Add the Recommendations component here */}
            <Recommendations playlistId={selectedPlaylist} />
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default PlaylistInput;
