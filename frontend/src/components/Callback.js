import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles.css"



//callback is what is gonna be used after authentication, essentailly grabs tokens from user after login


const Callback = ({ setAccessToken }) => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // Prevents running multiple times

  useEffect(() => {
    if (hasRun.current) {
      return; // if already ran return
    }
    hasRun.current = true;

    const hash = window.location.hash; //URL part after '#'

    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove '#' and parse parameters
      const token = params.get('access_token');

      if (token) {
        console.log('Access Token:', token); // console log to make sure this works
        setAccessToken(token); // Save token 
        window.location.hash = ''; // Clear after for security
        navigate('/app'); // Redirect back to app 
      } else {
        console.error('No token found in URL fragment'); // testing if callback is able to get token, check console log
        navigate('/'); // Redirect back to login if no token
      }
    } else {
      console.error('No hash found in URL'); // similar console log error to check if working
      navigate('/'); // Redirect back to login if no hash
    }
  }, [navigate, setAccessToken]);

  return <p>Processing login...</p>; // processing UI
};

export default Callback;
