import { MapPin } from 'lucide-react';

export default function LeaseCarCard({ lease, onLease }) {
  const isAvailable =
    String(lease.availabilityStatus).toLowerCase() === 'available';

  return (
    <div className='group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200'>
      <div className='relative'>
        <img
          src={lease.media?.hero || '/images/default-car.jpg'}
          alt={lease.carName}
          className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md'>
          {lease.region}
        </div>
        <div className='absolute top-3 right-3'>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <h3 className='font-bold text-lg text-gray-900'>{lease.carName}</h3>
            <p className='text-xs text-gray-500 capitalize'>
              {lease.leaseType?.replace('-', ' ') || '—'}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3 text-sm text-gray-700'>
          <div>
            <div className='text-gray-500'>Daily Rate</div>
            <div className='font-semibold'>
              {lease.dailyRate != null ? `$${lease.dailyRate}/day` : '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-500'>Monthly</div>
            <div className='font-semibold'>
              {lease.monthlyRate != null ? `$${lease.monthlyRate}/mo` : '-'}
            </div>
          </div>
          <div>
            <div className='text-gray-500'>Min–Max Days</div>
            <div className='font-semibold'>
              {(lease.minLeaseDays ?? '-') + '–' + (lease.maxLeaseDays ?? '-')}
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <MapPin size={16} className='text-gray-500' />
            <div className='font-semibold truncate'>
              {lease.location || '-'}
            </div>
          </div>
        </div>

        <button
          onClick={onLease}
          disabled={!isAvailable}
          className='mt-2 w-full px-4 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold disabled:opacity-50 hover:bg-red-600 transition'
        >
          Lease this car
        </button>
      </div>
    </div>
  );
}
