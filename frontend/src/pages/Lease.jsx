import { useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-select';
import {
  getLeaseCars,
  createLease,
  getMyLeases,
  deleteLeaseBooking,
} from '../services/api';
import toast from 'react-hot-toast';
import LeaseCarCard from '../components/LeaseCarCard';

export default function Lease() {
  const [filters, setFilters] = useState({
    name: '',
    region: 'All',
    area: 'All',
  });
  const [loading, setLoading] = useState(true);
  const [leaseCars, setLeaseCars] = useState([]);
  const [allLeaseCars, setAllLeaseCars] = useState([]);
  const [fetching, setFetching] = useState(false);
  const firstLoadRef = useRef(true);
  const fetchTimerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'my'
  const [myLeases, setMyLeases] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [insurancePlan, setInsurancePlan] = useState('Basic');

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const loadLeaseCars = async (isInitial = false) => {
    if (isInitial || firstLoadRef.current) setLoading(true);
    else {
      setFetching(true);
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
        fetchTimerRef.current = null;
      }
    }
    try {
      const params = {};
      if (filters.name.trim()) params.name = filters.name.trim();
      if (filters.region !== 'All') params.region = filters.region;
      if (filters.area !== 'All') params.location = filters.area.trim();
      const data = await getLeaseCars(params);
      if (!isInitial && !firstLoadRef.current) {
        // Always delay applying the new data by 2s to avoid jarring UI swaps
        fetchTimerRef.current = setTimeout(() => {
          setLeaseCars(data);
          setFetching(false);
          fetchTimerRef.current = null;
        }, 500);
      } else {
        setLeaseCars(data);
      }
    } catch {
      toast.error('Failed to load lease cars');
    } finally {
      if (isInitial || firstLoadRef.current) {
        setLoading(false);
        firstLoadRef.current = false;
      } else {
        // If request failed before scheduling timer
        if (fetchTimerRef.current === null && fetching) setFetching(false);
      }
    }
  };

  const loadAllLeaseCars = async () => {
    try {
      const data = await getLeaseCars({});
      setAllLeaseCars(data);
    } catch {
      // ignore
    }
  };

  const loadMyLeases = async () => {
    try {
      const uid = user?.id || user?.username;
      if (!uid) return;
      const data = await getMyLeases(uid);
      setMyLeases(data);
    } catch {
      toast.error('Failed to load your leases');
    }
  };

  useEffect(() => {
    loadLeaseCars(true);
    loadAllLeaseCars();
  }, []);

  // Reload when filters change (server-side filtering)
  useEffect(() => {
    loadLeaseCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.region, filters.area]);

  // Remove extra reset effect; handle area reset inline when region changes

  useEffect(() => {
    if (activeTab === 'my') loadMyLeases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const insurancePlans = ['Basic', 'Premium', 'Full Coverage'];

  const openLeaseModal = (lease) => {
    setSelectedLease(lease);
    setStartDate('');
    setEndDate('');
    setInsurancePlan(insurancePlans[0]);
    setModalOpen(true);
  };

  const addDays = (isoDate, days) => {
    const d = new Date(isoDate);
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const diffDays = (a, b) => {
    // difference in full days (end - start), end must be strictly after start to count a day
    const start = new Date(a);
    const end = new Date(b);
    const ms = end.getTime() - start.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  const confirmLease = async () => {
    try {
      const uid = user?.id || user?.username;
      if (!uid) {
        toast.error('Please log in again');
        return;
      }
      if (!selectedLease || !startDate || !endDate) {
        toast.error('Please fill all fields');
        return;
      }
      // Client-side validation to avoid 400s
      if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
        toast.error('End date must be after start date');
        return;
      }
      const days = diffDays(startDate, endDate);
      const minDays = Number(selectedLease.minLeaseDays ?? 0);
      const maxDays = Number(
        selectedLease.maxLeaseDays ?? Number.MAX_SAFE_INTEGER
      );
      if (days < minDays) {
        toast.error(`Minimum lease days is ${minDays}`);
        return;
      }
      if (days > maxDays) {
        toast.error(`Maximum lease days is ${maxDays}`);
        return;
      }
      const payload = {
        userId: uid,
        leaseId: selectedLease.id,
        startDate,
        endDate,
        insurancePlan,
      };
      const res = await createLease(payload);
      if (res?.id) {
        toast.success('Lease booked successfully');
        setModalOpen(false);
        setActiveTab('my');
        loadMyLeases();
      } else {
        toast.error(res?.error || 'Lease failed');
      }
    } catch {
      toast.error('Server not reachable');
    }
  };

  const onDeleteBooking = async (id) => {
    try {
      await deleteLeaseBooking(id);
      toast.success('Lease booking cancelled');
      loadMyLeases();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const AvailabilityPill = ({ status }) => {
    const isAvailable = String(status).toLowerCase() === 'available';
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isAvailable
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    );
  };

  const areaOptions = useMemo(() => {
    const pool =
      filters.region === 'All'
        ? allLeaseCars
        : allLeaseCars.filter((c) => c.region === filters.region);
    const unique = Array.from(
      new Set(pool.map((c) => c.location).filter(Boolean))
    );
    return [
      { value: 'All', label: 'All' },
      ...unique.map((l) => ({ value: l, label: l })),
    ];
  }, [allLeaseCars, filters.region]);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Lease Cars</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-md border ${
              activeTab === 'inventory'
                ? 'bg-[#EB0A1E] text-white border-[#EB0A1E]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-md border ${
              activeTab === 'my'
                ? 'bg-[#EB0A1E] text-white border-[#EB0A1E]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            My Leases
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <>
          {/* Filters */}
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap items-end gap-4'>
            <div className='flex-1 min-w-[220px]'>
              <label className='block text-sm text-gray-600 mb-1'>
                Search by car name
              </label>
              <input
                type='text'
                value={filters.name}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, name: e.target.value }))
                }
                placeholder='e.g., Corolla'
                className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]'
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Region</label>
              <Select
                options={[
                  { value: 'All', label: 'All' },
                  { value: 'US', label: 'US' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'EU', label: 'EU' },
                ]}
                value={[
                  { value: 'All', label: 'All' },
                  { value: 'US', label: 'US' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'EU', label: 'EU' },
                ].find((o) => o.value === filters.region)}
                onChange={(opt) =>
                  setFilters((f) => ({
                    ...f,
                    region: opt?.value || 'All',
                    area: 'All', // reset area when region changes
                  }))
                }
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    minWidth: '160px',
                  }),
                }}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600 mb-1'>Area</label>
              <Select
                options={areaOptions}
                value={areaOptions.find((o) => o.value === filters.area)}
                onChange={(opt) =>
                  setFilters((f) => ({ ...f, area: opt?.value || 'All' }))
                }
                isSearchable={false}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    borderColor: '#d1d5db',
                    boxShadow: 'none',
                    minWidth: '220px',
                  }),
                }}
              />
            </div>
            {fetching && (
              <div className='ml-auto mr-2 mb-2 text-gray-400'>
                <svg
                  className='animate-spin h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  ></path>
                </svg>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600'>
              Loading…
            </div>
          ) : leaseCars.length === 0 ? (
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-600'>
              No lease cars found.
            </div>
          ) : (
            <div className='relative'>
              {fetching && (
                <div className='absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl'>
                  <div className='flex items-center gap-2 text-gray-600'>
                    <svg
                      className='animate-spin h-5 w-5'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                      ></path>
                    </svg>
                    <span>Updating…</span>
                  </div>
                </div>
              )}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
                {leaseCars.map((c) => (
                  <LeaseCarCard
                    key={c.id}
                    lease={c}
                    onLease={() => openLeaseModal(c)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'my' && (
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto'>
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>My Leases</h3>
          </div>
          {myLeases.length === 0 ? (
            <p className='p-6 text-gray-600'>No leases yet.</p>
          ) : (
            <table className='min-w-full text-sm'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='text-left p-3'>Car</th>
                  <th className='text-left p-3'>Lease Id</th>
                  <th className='text-left p-3'>Start</th>
                  <th className='text-left p-3'>End</th>
                  <th className='text-left p-3'>Insurance</th>
                  <th className='text-left p-3'>Status</th>
                  <th className='text-left p-3'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {myLeases.map((b) => (
                  <tr key={b.id}>
                    <td className='p-3'>{b.carName || '-'}</td>
                    <td className='p-3'>{b.leaseId}</td>
                    <td className='p-3'>
                      {new Date(b.startDate).toLocaleDateString()}
                    </td>
                    <td className='p-3'>
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className='p-3'>{b.insurancePlan || '-'}</td>
                    <td className='p-3 capitalize'>{b.status}</td>
                    <td className='p-3'>
                      <button
                        onClick={() => onDeleteBooking(b.id)}
                        className='px-3 py-1.5 rounded-md border border-gray-300 hover:border-[#EB0A1E] hover:text-[#EB0A1E]'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && selectedLease && (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-lg'>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>
                Lease: {selectedLease.carName}
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ×
              </button>
            </div>
            <div className='p-4 space-y-4'>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Start Date
                </label>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartDate(v);
                    // Auto-suggest a valid end date based on minLeaseDays
                    const min = Number(selectedLease?.minLeaseDays ?? 1);
                    if (v) {
                      const suggested = addDays(v, Math.max(min, 1));
                      if (
                        !endDate ||
                        new Date(endDate) <= new Date(v) ||
                        new Date(endDate) < new Date(suggested)
                      ) {
                        setEndDate(suggested);
                      }
                    }
                  }}
                  className='w-full border border-gray-300 rounded-md px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  End Date
                </label>
                <input
                  type='date'
                  value={endDate}
                  min={startDate ? addDays(startDate, 1) : undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='w-full border border-gray-300 rounded-md px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-600 mb-1'>
                  Insurance Plan
                </label>
                <Select
                  options={insurancePlans.map((p) => ({
                    value: p,
                    label: p,
                  }))}
                  value={{ value: insurancePlan, label: insurancePlan }}
                  onChange={(opt) => setInsurancePlan(opt?.value || 'Basic')}
                  isSearchable={false}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '0.5rem',
                      borderColor: '#d1d5db',
                      boxShadow: 'none',
                    }),
                  }}
                />
              </div>
            </div>
            <div className='p-4 border-t border-gray-200 flex items-center justify-end gap-2'>
              <button
                onClick={() => setModalOpen(false)}
                className='px-4 py-2 rounded-md border border-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={confirmLease}
                className='px-4 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold'
              >
                Confirm Lease
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
