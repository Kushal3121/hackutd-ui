import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/TopBar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    else navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className='flex h-screen bg-toyotaGray-light font-sans'>
      <Sidebar onLogout={handleLogout} />
      <div className='flex-1 flex flex-col'>
        <Topbar user={user} />
        <main className='flex-1 overflow-y-auto p-6 bg-toyotaGray-light'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
