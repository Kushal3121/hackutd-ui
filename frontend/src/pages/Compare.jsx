import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCompareStore } from '../store/compareStore';
import { getCars, bookTestDrive } from '../services/api';
import toast from 'react-hot-toast';

function CompareColumn({ car }) {
  const [booking, setBooking] = useState(false);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const handleBook = async () => {
    try {
      setBooking(true);
      const payload = {
        userId: user?.id || user?.username || 'guest',
        carId: car.id,
        carName: car.name,
        color: null,
        packages: [],
        totalPrice: car.msrp,
      };
      const res = await bookTestDrive(payload);
      if (res?.id) toast.success('Test drive booked!');
      else toast.error(res?.error || 'Booking failed');
    } catch {
      toast.error('Server not reachable');
    } finally {
      setBooking(false);
    }
  };

  const handleAddToCart = () => {
    toast.success('Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3'
    >
      <div className='space-y-1'>
        <h3 className='text-lg font-semibold text-gray-900'>
          {car.name} {car.trim}
        </h3>
        <p className='text-sm text-gray-600'>Year: {car.year}</p>
      </div>

      <div className='text-sm text-gray-700 space-y-1'>
        <p>
          <strong>MSRP:</strong> {car.currency} {car.msrp.toLocaleString()}
        </p>
        <p>
          <strong>Price Range:</strong> {car.currency}{' '}
          {car.priceRange.min.toLocaleString()} - {car.currency}{' '}
          {car.priceRange.max.toLocaleString()}
        </p>
        <p>
          <strong>Powertrain:</strong> {car.powertrain} •{' '}
          <strong>Drivetrain:</strong> {car.drivetrain}
        </p>
        <p>
          <strong>Efficiency:</strong> {car.efficiency.city_mpg} city /{' '}
          {car.efficiency.hwy_mpg} hwy MPG
        </p>
        <p>
          <strong>Inventory:</strong> {car.inventory.location} • In stock:{' '}
          {car.inventory.inStock} • ETA: {car.inventory.deliveryEtaDays} days
        </p>
      </div>

      <div className='flex gap-3 pt-2'>
        <button
          onClick={handleBook}
          disabled={booking}
          className='px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all disabled:opacity-60'
          style={{ backgroundColor: '#EB0A1E' }}
        >
          {booking ? 'Booking…' : 'Book Test Drive'}
        </button>
        <button
          onClick={handleAddToCart}
          className='px-4 py-2 rounded-lg font-semibold border border-gray-300 text-gray-800 hover:border-toyotaRed transition'
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

export default function Compare() {
  const selected = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCars();
        setCars(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedCars = useMemo(() => {
    const map = new Map(cars.map((c) => [c.id, c]));
    return selected.map((s) => map.get(s.id)).filter(Boolean);
  }, [cars, selected]);

  const availableCars = useMemo(() => {
    const selectedIds = new Set(selected.map((s) => s.id));
    return cars.filter((c) => !selectedIds.has(c.id));
  }, [cars, selected]);

  const colsClass =
    selectedCars.length >= 3
      ? 'grid-cols-1 md:grid-cols-3'
      : selectedCars.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1';

  if (loading) return <p className='p-6'>Loading…</p>;

  const placeholders = Array.from({
    length: Math.max(0, 3 - selectedCars.length),
  });

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-2xl font-bold text-gray-900'>Compare Cars</h2>
        <div className='flex items-center gap-3'>
          <select
            className='border border-gray-300 rounded-md px-3 py-2 text-sm'
            onChange={(e) => {
              const car = cars.find((c) => c.id === e.target.value);
              if (car) toggle(car);
              e.target.value = '';
            }}
            defaultValue=''
          >
            <option value='' disabled>
              Add car to compare…
            </option>
            {availableCars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.trim} ({c.year})
              </option>
            ))}
          </select>
          <button
            onClick={clear}
            className='px-3 py-2 rounded-md border border-gray-300 text-sm font-semibold hover:border-toyotaRed transition'
          >
            Clear All
          </button>
        </div>
      </div>
      <div className={`grid gap-5 ${colsClass}`}>
        {selectedCars.map((car) => (
          <div key={car.id} className='relative'>
            <CompareColumn car={car} />
            <button
              onClick={() => toggle(car)}
              className='absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-8 h-8 grid place-items-center text-gray-600 hover:border-toyotaRed'
              title='Remove'
            >
              ×
            </button>
          </div>
        ))}
        {placeholders.map((_, idx) => (
          <motion.div
            key={`ph-${idx}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-5 text-gray-600 space-y-3'
          >
            <div className='grid place-items-center'>
              Select another car to compare
            </div>
            <div className='flex items-center gap-2'>
              <select
                className='border border-gray-300 rounded-md px-3 py-2 text-sm flex-1'
                onChange={(e) => {
                  const car = cars.find((c) => c.id === e.target.value);
                  if (car) toggle(car);
                  e.target.value = '';
                }}
                defaultValue=''
              >
                <option value='' disabled>
                  Choose a car…
                </option>
                {availableCars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.trim} ({c.year})
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (availableCars.length === 0) {
                    toast.error('No more cars available to add');
                  }
                }}
                className='px-3 py-2 rounded-md bg-toyotaRed text-white text-sm font-semibold disabled:opacity-60'
                disabled={availableCars.length === 0}
              >
                Add
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
