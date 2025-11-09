import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import AdvancedFilters from '../components/AdvancedFilters';

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getCars();
        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ---------- Derived option sets ----------
  const allSeries = useMemo(
    () => Array.from(new Set(cars.map((c) => c.series).filter(Boolean))).sort(),
    [cars]
  );
  const allRegions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.region).filter(Boolean))),
    [cars]
  );
  const allDrivetrains = useMemo(
    () => Array.from(new Set(cars.map((c) => c.drivetrain).filter(Boolean))),
    [cars]
  );
  const allPowertrains = useMemo(
    () => Array.from(new Set(cars.map((c) => c.powertrain).filter(Boolean))),
    [cars]
  );
  const allLocations = useMemo(
    () =>
      Array.from(
        new Set(cars.map((c) => c?.inventory?.location).filter(Boolean))
      ).sort(),
    [cars]
  );
  const allColors = useMemo(() => {
    const set = new Set();
    for (const c of cars) {
      (c.colors || []).forEach((clr) =>
        set.add(clr?.name || clr?.color || clr)
      );
    }
    return Array.from(set).filter(Boolean).sort();
  }, [cars]);
  const allPackages = useMemo(() => {
    const set = new Set();
    for (const c of cars) {
      (c.packages || []).forEach((p) => set.add(p?.name || p));
    }
    return Array.from(set).filter(Boolean).sort();
  }, [cars]);
  const years = useMemo(
    () => Array.from(new Set(cars.map((c) => c.year).filter(Boolean))).sort(),
    [cars]
  );
  const minMsrp = useMemo(
    () => Math.min(...cars.map((c) => Number(c.msrp || 0))),
    [cars]
  );
  const maxMsrp = useMemo(
    () => Math.max(...cars.map((c) => Number(c.msrp || 0))),
    [cars]
  );
  const minLease = useMemo(
    () => Math.min(...cars.map((c) => Number(c?.lease?.monthly || 0))),
    [cars]
  );
  const maxLease = useMemo(
    () => Math.max(...cars.map((c) => Number(c?.lease?.monthly || 0))),
    [cars]
  );
  const minFinance = useMemo(
    () =>
      Math.min(...cars.map((c) => Number(c?.finance?.estimatedMonthly || 0))),
    [cars]
  );
  const maxFinance = useMemo(
    () =>
      Math.max(...cars.map((c) => Number(c?.finance?.estimatedMonthly || 0))),
    [cars]
  );
  const minCity = useMemo(
    () => Math.min(...cars.map((c) => Number(c?.efficiency?.city_mpg || 0))),
    [cars]
  );
  const maxCity = useMemo(
    () => Math.max(...cars.map((c) => Number(c?.efficiency?.city_mpg || 0))),
    [cars]
  );
  const minHwy = useMemo(
    () => Math.min(...cars.map((c) => Number(c?.efficiency?.hwy_mpg || 0))),
    [cars]
  );
  const maxHwy = useMemo(
    () => Math.max(...cars.map((c) => Number(c?.efficiency?.hwy_mpg || 0))),
    [cars]
  );

  // ---------- Filter state ----------
  const [query, setQuery] = useState('');
  const [series, setSeries] = useState([]); // array of values
  const [region, setRegion] = useState('All');
  const [yearsSelected, setYearsSelected] = useState([]); // multi
  const [drivetrains, setDrivetrains] = useState([]);
  const [powertrains, setPowertrains] = useState([]);
  const [msrpRange, setMsrpRange] = useState([0, 0]);
  const [leaseRange, setLeaseRange] = useState([0, 0]);
  const [financeRange, setFinanceRange] = useState([0, 0]);
  const [cityRange, setCityRange] = useState([0, 0]);
  const [hwyRange, setHwyRange] = useState([0, 0]);
  const [location, setLocation] = useState('All');
  const [colors, setColors] = useState([]);
  const [pkg, setPkg] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState('none');
  const [lastParsed, setLastParsed] = useState(null);

  // initialize ranges after cars load
  useEffect(() => {
    if (cars.length) {
      setMsrpRange([minMsrp, maxMsrp]);
      setLeaseRange([minLease, maxLease]);
      setFinanceRange([minFinance, maxFinance]);
      setCityRange([minCity, maxCity]);
      setHwyRange([minHwy, maxHwy]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars.length]);

  const clearFilters = () => {
    setQuery('');
    setSeries([]);
    setRegion('All');
    setYearsSelected([]);
    setDrivetrains([]);
    setPowertrains([]);
    setMsrpRange([minMsrp, maxMsrp]);
    setLeaseRange([minLease, maxLease]);
    setFinanceRange([minFinance, maxFinance]);
    setCityRange([minCity, maxCity]);
    setHwyRange([minHwy, maxHwy]);
    setLocation('All');
    setColors([]);
    setPkg([]);
    setInStockOnly(false);
    setSortKey('none');
    setVisibleCount(24);
  };

  // ---------- Apply parsed command from SmartSearchInput ----------
  const applyParsedFilters = (result) => {
    if (!result || typeof result !== 'object') return;
    setLastParsed(result);
    const { action, filters = {} } = result;
    // Always reset count
    setVisibleCount(24);
    // If "compare", for now we do not navigate; we surface parsed info only.
    // We still apply reasonable search defaults if models present.
    if (
      action === 'compare' &&
      Array.isArray(filters.models) &&
      filters.models.length
    ) {
      setQuery(filters.models.join(' '));
    } else if (filters.model) {
      setQuery(String(filters.model));
    }
    if (typeof filters.maxPrice === 'number' && Number.isFinite(minMsrp)) {
      const hi = Math.max(minMsrp, filters.maxPrice);
      setMsrpRange([minMsrp, hi]);
      setSortKey('price_asc');
    }
    if (filters.region) {
      setRegion(filters.region);
    }
    if (filters.bodyType) {
      setSeries([filters.bodyType]);
    }
    if (filters.powertrain) {
      setPowertrains([filters.powertrain]);
    }
    if (filters.drivetrain) {
      setDrivetrains([filters.drivetrain]);
    }
    if (typeof filters.year === 'number') {
      setYearsSelected([filters.year]);
    }
  };

  // ---------- Filtering ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = cars.filter((c) => {
      if (q) {
        const name = `${c.name} ${c.trim} ${c.modelCode}`.toLowerCase();
        if (!name.includes(q)) return false;
      }
      if (region !== 'All' && c.region !== region) return false;
      if (series.length && !series.includes(c.series)) return false;
      if (yearsSelected.length && !yearsSelected.includes(c.year)) return false;
      if (drivetrains.length && !drivetrains.includes(c.drivetrain))
        return false;
      if (powertrains.length && !powertrains.includes(c.powertrain))
        return false;
      const msrp = Number(c.msrp || 0);
      if (msrp < msrpRange[0] || msrp > msrpRange[1]) return false;
      const lease = Number(c?.lease?.monthly || 0);
      if (lease < leaseRange[0] || lease > leaseRange[1]) return false;
      const finance = Number(c?.finance?.estimatedMonthly || 0);
      if (finance < financeRange[0] || finance > financeRange[1]) return false;
      const city = Number(c?.efficiency?.city_mpg || 0);
      if (city < cityRange[0] || city > cityRange[1]) return false;
      const hwy = Number(c?.efficiency?.hwy_mpg || 0);
      if (hwy < hwyRange[0] || hwy > hwyRange[1]) return false;
      if (location !== 'All' && c?.inventory?.location !== location)
        return false;
      if (inStockOnly && Number(c?.inventory?.inStock || 0) <= 0) return false;
      if (colors.length) {
        const names = (c.colors || [])
          .map((cl) => cl?.name || cl)
          .filter(Boolean);
        if (!colors.every((x) => names.includes(x))) return false;
      }
      if (pkg.length) {
        const names = (c.packages || [])
          .map((p) => p?.name || p)
          .filter(Boolean);
        if (!pkg.every((x) => names.includes(x))) return false;
      }
      return true;
    });

    // sorting
    if (sortKey === 'price_asc') {
      list.sort((a, b) => a.msrp - b.msrp);
    } else if (sortKey === 'price_desc') {
      list.sort((a, b) => b.msrp - a.msrp);
    } else if (sortKey === 'mpg_desc') {
      list.sort(
        (a, b) =>
          (b?.efficiency?.city_mpg || 0) +
          (b?.efficiency?.hwy_mpg || 0) -
          ((a?.efficiency?.city_mpg || 0) + (a?.efficiency?.hwy_mpg || 0))
      );
    } else if (sortKey === 'lease_asc') {
      list.sort((a, b) => (a?.lease?.monthly || 0) - (b?.lease?.monthly || 0));
    }
    return list;
  }, [
    cars,
    query,
    series,
    region,
    yearsSelected,
    drivetrains,
    powertrains,
    msrpRange,
    leaseRange,
    financeRange,
    cityRange,
    hwyRange,
    location,
    colors,
    pkg,
    inStockOnly,
    sortKey,
  ]);

  if (loading) return <p className='text-center mt-10'>Loading cars...</p>;
  if (error) return <p className='text-center text-red-600 mt-10'>{error}</p>;

  return (
    <div className='p-6'>
      {/* Filters Header */}
      <div className='mb-4 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3 flex-shrink-0'>
          <button
            onClick={() => setDrawerOpen(true)}
            className='px-4 py-2 rounded-md border border-gray-300 font-semibold hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
          >
            Open Filters
          </button>
          <div className='text-gray-600 text-sm'>
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
          </div>
        </div>
        {/* Inline search */}
        <div className='flex-1'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search cars...'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]'
          />
        </div>
        <div className='flex-shrink-0'>
          <Select
            options={[
              { value: 'none', label: 'Sort: Default' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'mpg_desc', label: 'Best MPG' },
              { value: 'lease_asc', label: 'Lowest Lease Monthly' },
            ]}
            value={[
              { value: 'none', label: 'Sort: Default' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'mpg_desc', label: 'Best MPG' },
              { value: 'lease_asc', label: 'Lowest Lease Monthly' },
            ].find((o) => o.value === sortKey)}
            onChange={(opt) => setSortKey(opt?.value || 'none')}
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
      </div>

      {/* Sliding Advanced Filters */}
      <AdvancedFilters
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onParsedCommand={applyParsedFilters}
        lastParsed={lastParsed}
        matchCount={filtered.length}
        visibleCount={Math.min(visibleCount, filtered.length)}
        clearFilters={clearFilters}
        allSeries={allSeries}
        allRegions={allRegions}
        years={years}
        allDrivetrains={allDrivetrains}
        allPowertrains={allPowertrains}
        allLocations={allLocations}
        allColors={allColors}
        allPackages={allPackages}
        currencyCode={cars[0]?.currency || 'USD'}
        minMsrp={minMsrp}
        maxMsrp={maxMsrp}
        minLease={minLease}
        maxLease={maxLease}
        minFinance={minFinance}
        maxFinance={maxFinance}
        minCity={minCity}
        maxCity={maxCity}
        minHwy={minHwy}
        maxHwy={maxHwy}
        query={query}
        setQuery={setQuery}
        series={series}
        setSeries={setSeries}
        region={region}
        setRegion={setRegion}
        yearsSelected={yearsSelected}
        setYearsSelected={setYearsSelected}
        drivetrains={drivetrains}
        setDrivetrains={setDrivetrains}
        powertrains={powertrains}
        setPowertrains={setPowertrains}
        msrpRange={msrpRange}
        setMsrpRange={setMsrpRange}
        leaseRange={leaseRange}
        setLeaseRange={setLeaseRange}
        financeRange={financeRange}
        setFinanceRange={setFinanceRange}
        cityRange={cityRange}
        setCityRange={setCityRange}
        hwyRange={hwyRange}
        setHwyRange={setHwyRange}
        location={location}
        setLocation={setLocation}
        colors={colors}
        setColors={setColors}
        pkg={pkg}
        setPkg={setPkg}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        sortKey={sortKey}
        setSortKey={setSortKey}
      />

      {/* Recommended */}
      {filtered.length > 3 && (
        <div className='mb-6'>
          <h3 className='text-lg font-semibold mb-3 text-gray-900'>
            Recommended for you
          </h3>
          <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {getRecommended(filtered).map((car) => (
              <CarCard key={`rec-${car.id}`} car={car} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
        {filtered.slice(0, visibleCount).map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className='flex justify-center mt-6'>
          <button
            onClick={() => setVisibleCount((v) => v + 24)}
            className='px-5 py-2 rounded-md border border-gray-300 font-semibold hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function getRecommended(list) {
  const scored = list.map((c) => {
    const lease = Number(c?.lease?.monthly || 0);
    const mpg = Number(c?.efficiency?.city_mpg || 0);
    // lower lease and higher mpg better
    const score = (lease ? 10000 / lease : 0) + mpg;
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.c);
}
