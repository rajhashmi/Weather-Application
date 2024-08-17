import React from 'react';
import CityRow from './CityRow';


interface City {
  name: string;
  country: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
}


interface CityTableProps {
  filteredCities: City[]; 
  sortConfig: { key: keyof City; direction: 'asc' | 'desc' } | null; 
  handleSort: (key: keyof City) => void; 
  lastCityCallback: (node: HTMLTableRowElement | null) => void; 
  loading: boolean; 
}

const CityTable: React.FC<CityTableProps> = ({
  filteredCities,
  sortConfig,
  handleSort,
  lastCityCallback,
  loading,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('name')}
            >
              City Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('country')}
            >
              Country {sortConfig?.key === 'country' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('timezone')}
            >
              Timezone {sortConfig?.key === 'timezone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('population')}
            >
              Population {sortConfig?.key === 'population' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('latitude')}
            >
              Latitude {sortConfig?.key === 'latitude' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th
              className="px-6 py-3 text-left font-bold cursor-pointer"
              onClick={() => handleSort('longitude')}
            >
              Longitude {sortConfig?.key === 'longitude' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.map((city, index) => (
            <CityRow
              key={index}  
              city={city}
              isLast={index === filteredCities.length - 1} 
              refCallback={lastCityCallback}  
              index={index}  
            />
          ))}
          {loading && (
            <tr>
              <td className="px-6 py-4 border-b text-center" colSpan={6}>
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto"></div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
