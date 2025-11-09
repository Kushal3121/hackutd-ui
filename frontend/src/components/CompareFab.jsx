import { useNavigate } from 'react-router-dom';
import { useCompareStore } from '../store/compareStore';

export default function CompareFab() {
  const navigate = useNavigate();
  const items = useCompareStore((s) => s.items);
  const count = items.length;
  if (count < 2) return null;
  return (
    <button
      onClick={() => navigate('/dashboard/compare')}
      className='fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-toyotaRed text-white shadow-lg font-semibold hover:bg-toyotaRed-dark transition'
    >
      Compare ({count})
    </button>
  );
}


