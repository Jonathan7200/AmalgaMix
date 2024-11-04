import React from 'react';
import './App.css';
import Login from './Login'; // Import the Login component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login />  {/* Render the Login component here */}
      </header>
    </div>
  );
}

export default App;
