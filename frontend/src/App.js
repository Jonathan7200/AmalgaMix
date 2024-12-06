import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import PlaylistInput from './components/PlaylistInput';
import Recommendations from './components/Recommendations'; // Add the Recommendations component

const App = () => {
  console.log("App loaded"); // Test console log to verify the app loads properly
  const [accessToken, setAccessToken] = useState(null); // Sets token to null
  const [playlistId, setPlaylistId] = useState(null); // Track playlistId for recommendation

  // Handle the button click to trigger the recommendation fetch
  const handleSendToMLModel = (selectedPlaylistId) => {
    setPlaylistId(selectedPlaylistId);
  };

  // Routes for login, callback, and the app with playlist input and recommendations
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/callback"
          element={<Callback setAccessToken={setAccessToken} />}
        />
        <Route
          path="/app"
          element={
            accessToken ? (
              <>
                {console.log('Access Token in App:', accessToken)} {/* making sure this works check console log */}
                <PlaylistInput accessToken={accessToken} />
              </>
            ) : (
              <Login />
            )
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
