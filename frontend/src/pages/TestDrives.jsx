import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getAllTestDrives, deleteTestDrive } from '../services/api';

export default function TestDrives() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTestDrives(user?.id || user?.username);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load test drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTestDrive(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <p className='p-6'>Loading test drives…</p>;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>My Test Drives</h2>
        <button
          onClick={fetchData}
          className='px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:border-toyotaRed transition'
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-gray-600 text-center'>
          No test drives booked yet.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white'>
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-gray-100 text-gray-800 border-b border-gray-200'>
              <tr>
                <th className='p-4 font-semibold'>#</th>
                <th className='p-4 font-semibold'>Car</th>
                <th className='p-4 font-semibold'>Color</th>
                <th className='p-4 font-semibold'>Packages</th>
                <th className='p-4 font-semibold'>Total Price</th>
                <th className='p-4 font-semibold'>ETA (days)</th>
                <th className='p-4 font-semibold'>Booked At</th>
                <th className='p-4 font-semibold text-center'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {items.map((td, idx) => (
                <tr key={td.id} className='hover:bg-gray-50 transition'>
                  <td className='p-4 text-gray-600'>{idx + 1}</td>
                  <td className='p-4 font-medium text-gray-900'>
                    {td.carName}
                  </td>
                  <td className='p-4 text-gray-700'>{td.color || '—'}</td>
                  <td className='p-4 text-gray-700'>
                    {Array.isArray(td.packages) && td.packages.length > 0
                      ? td.packages.join(', ')
                      : '—'}
                  </td>
                  <td className='p-4 text-gray-800'>
                    {td.totalPrice
                      ? `USD ${td.totalPrice.toLocaleString()}`
                      : '—'}
                  </td>
                  <td className='p-4 text-gray-700'>{td.etaDays}</td>
                  <td className='p-4 text-gray-700'>
                    {new Date(td.bookedAt).toLocaleString()}
                  </td>
                  <td className='p-4 text-center'>
                    <button
                      onClick={() => handleDelete(td.id)}
                      className='px-4 py-1.5 border border-gray-300 rounded-md text-sm font-semibold hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
