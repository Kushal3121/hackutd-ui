export default function Topbar({ user }) {
  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-6 border-b border-toyotaGray-mid'>
      <h1 className='text-lg font-semibold text-toyotaGray'>
        {user ? `Welcome, ${user.name || user.username}` : 'Dashboard'}
      </h1>
      <input
        type='text'
        placeholder='Search cars...'
        className='border border-toyotaGray-mid rounded-lg px-3 py-1 text-sm w-60 focus:ring-2 focus:ring-toyotaRed-light focus:outline-none'
      />
    </header>
  );
}
