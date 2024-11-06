import React from 'react';

const Login = () => {
    const handleLogin = () => {
       
        window.location.href = 'http://localhost:3000/login'; 
    };

    return (
        <div className="login-container">
            <h1>Welcome to Spotify Playlist Generator</h1>
            <p>Click the button below to log in with your Spotify account.</p>
            <button onClick={handleLogin} className="login-button">
                Login with Spotify
            </button>
        </div>
    );
};

export default Login;