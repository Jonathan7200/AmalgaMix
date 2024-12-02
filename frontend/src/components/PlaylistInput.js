import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    setSelectedPlaylist(event.target.value)
  }

  const handleSubmit = async () => {
    try {
     
      console.log('Submitting playlist:', selectedPlaylist);
      
      const response = await axios.post('/api/submit-playlist', {
        playlistId: selectedPlaylist,
        tracks: tracks,
      });
     
    } catch (error) {
      console.error('Error submitting playlist:', error);
      setError('Failed to submit playlist. Please try again.');
    }
  };
  

  if (error) {
    return <p>{error}</p>;
  }




///// Putting everything together >.<   /////
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
              if (!playlist) return null; // Skip null, broke my code earlier T.T
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
        {selectedPlaylist && 
          (<div> 
            <h3>Tracks in Playlist</h3>
            {isLoadingTracks ? ( <p>Loading</p>)
              : tracks.length > 0 ? (
                <ul>
                  {tracks.map((trackItem) => {
                    const track = trackItem.track;
                    return track ? (
                      <li key={track.id}>{track.name}</li>
                    ) : null;
                  })}
                </ul>
              ) :
              (<p>No tracks in Playlist</p>)}
            
            </div>)}
            <button onClick={handleSubmit} disable = {isLoadingTracks}>
              SEND TO ML MODEL
            </button>
              
        </div>
      )};
    </div>
  );
};

export default PlaylistInput;
