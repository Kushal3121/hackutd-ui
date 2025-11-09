import { useEffect, useRef, useState } from 'react';
import { User, LogOut } from 'lucide-react';

export default function Topbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-6 border-b border-toyotaGray-mid relative'>
      <h1 className='text-lg font-semibold text-toyotaGray'>
        {user ? `Welcome, ${user.name || user.username}` : 'Dashboard'}
      </h1>
      <div className='relative' ref={menuRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className='p-2 rounded-full border border-toyotaGray-mid text-toyotaGray hover:bg-toyotaRed-light hover:text-white transition'
          aria-label='Profile menu'
        >
          <User size={20} />
        </button>

        {open && (
          <div className='absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50'>
            <div className='flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-toyotaRed/10 flex items-center justify-center text-toyotaRed font-bold uppercase'>
                {(user?.name || user?.username || '?')
                  .toString()
                  .slice(0, 1)}
              </div>
              <div>
                <div className='text-sm font-semibold text-gray-900'>
                  {user?.name || 'User'}
                </div>
                <div className='text-xs text-gray-500'>
                  @{user?.username || 'unknown'}
                </div>
              </div>
            </div>
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout && onLogout();
                }}
                className='w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-toyotaGray hover:bg-toyotaRed-light hover:text-white transition'
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
