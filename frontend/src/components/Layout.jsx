import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Folder, Cpu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center text-xl font-bold text-primary">
                Orbit
              </Link>
              <div className="ml-10 flex space-x-4">
                <Link to="/projects" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary">
                  <Folder className="w-4 h-4 mr-2" />
                  Projects
                </Link>
                <Link to="/technologies" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary">
                  <Cpu className="w-4 h-4 mr-2" />
                  Technologies
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button onClick={handleLogout} className="flex items-center text-gray-700 hover:text-red-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
