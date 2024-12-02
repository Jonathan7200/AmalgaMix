import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Callback from './components/Callback';
import PlaylistInput from './components/PlaylistInput';

const App = () => {
  console.log("app loaded") //testing console log if app loads properly
  const [accessToken, setAccessToken] = useState(null); //sets token to null


  //routes to callback which gets access token
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
