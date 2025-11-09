import SearchBar from '../components/SearchBar';

export default function Topbar({ user }) {
  const handleCarSelect = (car) => {
    console.log('Selected car:', car);
    // later: navigate(`/dashboard/cars/${car.id}`);
  };

  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-6 border-b border-toyotaGray-mid'>
      <h1 className='text-lg font-semibold text-toyotaGray'>
        {user ? `Welcome, ${user.name || user.username}` : 'Dashboard'}
      </h1>
      <SearchBar onSelect={handleCarSelect} />
    </header>
  );
}
