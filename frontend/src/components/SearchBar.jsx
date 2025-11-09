import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getCars } from '../services/api';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Preload all cars once
    getCars().then(setAllCars).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Filter cars locally
    const filtered = allCars.filter((car) =>
      `${car.name} ${car.trim} ${car.year} ${car.region}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setResults(filtered.slice(0, 5)); // limit to top 5
    setShowDropdown(true);
  };

  const handleSelect = (car) => {
    setQuery('');
    setShowDropdown(false);
    onSelect?.(car);
  };

  return (
    <div className='relative w-64'>
      <div className='relative'>
        <Search
          className='absolute left-3 top-2.5 text-toyotaGray-mid pointer-events-none'
          size={18}
        />
        <input
          type='text'
          value={query}
          onChange={handleChange}
          placeholder='Search cars...'
          className='w-full border border-toyotaGray-mid rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-toyotaRed-light focus:outline-none bg-white'
        />
      </div>

      {showDropdown && results.length > 0 && (
        <ul className='absolute z-20 mt-2 bg-white shadow-lg rounded-lg border border-toyotaGray-mid w-full overflow-hidden'>
          {results.map((car) => (
            <li
              key={car.id}
              className='px-3 py-2 hover:bg-toyotaRed hover:text-white cursor-pointer transition'
              onClick={() => handleSelect(car)}
            >
              <p className='font-medium text-sm'>{car.name}</p>
              <p className='text-xs opacity-80'>
                {car.trim} • {car.year} • {car.region}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
