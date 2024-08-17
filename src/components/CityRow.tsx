import React from 'react';
import { Link } from 'react-router-dom';

interface City {
  name: string;
  country: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
}

interface CityRowProps {
  city: City;  
  isLast: boolean;  
  refCallback: (node: HTMLTableRowElement | null) => void;  
  index: number;  
}

const CityRow: React.FC<CityRowProps> = ({ city, isLast, refCallback, index }) => {
  return (
    <tr
      ref={isLast ? refCallback : null}
      className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
      style={{ fontFamily: 'Noto Sans, sans-serif' }}
    >
      <td className="px-6 py-4 border-b text-gray-800">
        <Link
          to={`/weather/${city.name}`}
          state={{ latitude: city.latitude, longitude: city.longitude }}
          className="text-blue-600 hover:underline"
        >
          {city.name}
        </Link>
      </td>
      <td className="px-6 py-4 border-b text-gray-800">{city.country}</td>
      <td className="px-6 py-4 border-b text-gray-800">{city.timezone}</td>
      <td className="px-6 py-4 border-b text-gray-800">{city.population}</td>
      <td className="px-6 py-4 border-b text-gray-800">{city.latitude}</td>
      <td className="px-6 py-4 border-b text-gray-800">{city.longitude}</td>
    </tr>
  );
};

export default CityRow;
