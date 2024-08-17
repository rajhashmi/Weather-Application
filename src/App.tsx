import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WeatherPage from './components/WeatherPage'; 
import './App.css';  
import CityTableStyled from './components/CityTableStyle';  

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CityTableStyled />} />
          <Route path="/weather/:cityName" element={<WeatherPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
