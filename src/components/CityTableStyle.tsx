import React, { useState, useEffect, useRef, useCallback } from 'react';
import SearchBar from './Search'; // Import SearchBar component
import { Link } from 'react-router-dom';

interface City {
  name: string;
  country: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
}

const CityTableStyled: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof City; direction: 'asc' | 'desc' } | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCityRef = useRef<HTMLTableRowElement | null>(null);

  const fetchCities = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=20&start=${page * 20}&sort=name`
      );
      const data = await response.json();

      const newCities = data.records.map((record: any) => ({
        name: record.fields.name,
        country: record.fields.cou_name_en,
        timezone: record.fields.timezone,
        population: record.fields.population,
        latitude: record.fields.coordinates[0],
        longitude: record.fields.coordinates[1],
      }));
      setCities((prevCities) => [...prevCities, ...newCities]);
      setFilteredCities((prevCities) => [...prevCities, ...newCities]);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);

    let filtered = cities;

    if (value !== '') {
      filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      filtered = sortCities(filtered, sortConfig.key, sortConfig.direction);
    }

    setFilteredCities(filtered);
  };

  const sortCities = (citiesToSort: City[], key: keyof City, direction: 'asc' | 'desc') => {
    return [...citiesToSort].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (key: keyof City) => {
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedCities = sortCities(filteredCities, key, direction);
    setSortConfig({ key, direction });
    setFilteredCities(sortedCities);
  };

  const lastCityCallback = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading || searchInput !== '') return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, searchInput]
  );

  useEffect(() => {
    fetchCities(page);
  }, [page]);

  useEffect(() => {
    if (lastCityRef.current) {
      lastCityCallback(lastCityRef.current);
    }
  }, [lastCityRef, lastCityCallback, filteredCities]);

  return (
    <div className="p-4 md:p-8">
      <SearchBar searchInput={searchInput} handleSearchChange={handleSearchChange} />
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
        <table className="min-w-full table-auto text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('name')}
              >
                City Name {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('country')}
              >
                Country {sortConfig?.key === 'country' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('timezone')}
              >
                Timezone {sortConfig?.key === 'timezone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('population')}
              >
                Population {sortConfig?.key === 'population' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('latitude')}
              >
                Latitude {sortConfig?.key === 'latitude' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-2 py-3 md:px-6 text-left font-bold cursor-pointer"
                onClick={() => handleSort('longitude')}
              >
                Longitude {sortConfig?.key === 'longitude' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city, index) => (
              <tr
                key={index}
                ref={index === filteredCities.length - 1 ? lastCityRef : null}
                className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                style={{ fontFamily: 'Noto Sans, sans-serif' }}
              >
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">
                  <Link
                    to={`/weather/${city.name}`}
                    state={{ latitude: city.latitude, longitude: city.longitude }}
                    className="text-blue-600 hover:underline"
                  >
                    {city.name}
                  </Link>
                </td>
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">{city.country}</td>
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">{city.timezone}</td>
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">{city.population}</td>
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">{city.latitude}</td>
                <td className="px-2 py-2 md:px-6 border-b text-gray-800">{city.longitude}</td>
              </tr>
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
    </div>
  );
};

export default CityTableStyled;
