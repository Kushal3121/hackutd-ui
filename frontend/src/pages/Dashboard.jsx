import { useEffect, useState } from 'react';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (err) {
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) return <p className='text-center mt-10'>Loading cars...</p>;
  if (error) return <p className='text-center text-red-600 mt-10'>{error}</p>;

  return (
    <div className='p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
