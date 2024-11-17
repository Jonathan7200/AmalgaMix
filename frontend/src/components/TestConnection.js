import React, { useState, useEffect } from 'react';
import axios from 'axios';


function TestConnection() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/test-ml-service');
        setMessage(response.data.data.message);
      } catch (error) {
        console.error('Error connecting to backend:', error);
        setMessage('Error connecting to backend');
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h1>Testing Front End Connection</h1>
      <p>Message from ML Service: {message}</p>
    </div>
  );
}

export default TestConnection;