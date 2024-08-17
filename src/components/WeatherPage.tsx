import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faSun, faCloudSunRain } from '@fortawesome/free-solid-svg-icons';
import CityTableStyled from './CityTableStyle';

const apiKey = process.env.REACT_APP_API_KEY;

interface WeatherData {
  temperature: number;
  description: string;
  main: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
}

interface LocationState {
  latitude: number;
  longitude: number;
}

const WeatherPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const location = useLocation();
  const { latitude, longitude } = location.state as LocationState;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setWeatherData({
          temperature: data.main.temp,
          description: data.weather[0].description,
          main: data.weather[0].main,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windSpeed: data.wind.speed,
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to load weather data');
      }
    };

    fetchWeather();
  }, [cityName, latitude, longitude]);

  if (error) {
    return <div className='p-4 text-red-500'>{error}</div>;
  }

  if (!weatherData) {
    return <div className='p-4'>Loading weather data...</div>;
  }

  const backgroundImages: { [key: string]: string } = {
    Clear: '/images/sunny.jpeg',
    Clouds: '/images/cloudy.jpeg',
    Rain: '/images/rain.jpeg',
    Snow: '/images/rain.jpeg',
    Thunderstorm: '/images/thunderstorm.jpeg',
  };

  const backgroundImage = backgroundImages[weatherData.main] || '/images/default.jpeg';

  return (
    <div className='flex'>
      <div
        className='flex flex-col justify-center items-center w-1/2 h-screen text-white text-center p-5 relative overflow-hidden'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='absolute inset-0 bg-black bg-opacity-50 z-10' />
        
        <a
          href='/'
          className=' text-center  z-20 text-white text-xl font-semibold  top-2 left-64 p-2'
        >
          Home
        </a>
        
        <div className='relative z-20 bg-white bg-opacity-20 rounded-lg p-5 shadow-lg w-full max-w-md'>
          <div className='mb-5'>
            {weatherData.main === 'Rain' && <FontAwesomeIcon className='text-6xl' icon={faCloudRain} bounce />}
            {weatherData.main === 'Clear' && <FontAwesomeIcon className='text-6xl' icon={faSun} spin />}
            {weatherData.main === 'Clouds' && <FontAwesomeIcon className='text-6xl' icon={faCloudSunRain} bounce />}
          </div>

          <h1 className='my-2 text-2xl'>Weather in {cityName}</h1>
          <p className='my-1 text-xl'>Temperature: {weatherData.temperature}°C</p>
          <p className='my-1 text-xl'>Description: {weatherData.description}</p>
          <p className='my-1 text-xl'>Humidity: {weatherData.humidity}%</p>
          <p className='my-1 text-xl'>Pressure: {weatherData.pressure} hPa</p>
          <p className='my-1 text-xl'>Wind Speed: {weatherData.windSpeed} m/s</p>
        </div>
      </div>

      <div className='w-1/2 h-screen overflow-y-scroll'>
        <CityTableStyled />
      </div>
    </div>
  );
};

export default WeatherPage;
