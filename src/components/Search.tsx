import React from 'react';

interface SearchBarProps {
  searchInput: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchInput, handleSearchChange }) => {
  return (
    <div className="w-full max-w-md mb-4">
      <input
        type="text"
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Search for a city..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default SearchBar;
