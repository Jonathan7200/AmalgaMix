import React from 'react';

const Login = () => {
    const handleLogin = () => {
        console.log('Login component loaded'); 
        const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
        const redirectUri = 'http://localhost:3000/callback';
        const scopes = [
          'playlist-read-private',
          'playlist-read-collaborative',
          
        ];
        const authEndpoint = 'https://accounts.spotify.com/authorize';
      
        const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${encodeURIComponent(scopes.join(' '))}&response_type=token&show_dialog=true`;
      
        window.location.href = authUrl;
      };

  return (
    <div className="login-container">
      <h1>Welcome to Amalgamix!!!</h1>
      <p>Click the button to log in with your Spotify account.</p>
      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
