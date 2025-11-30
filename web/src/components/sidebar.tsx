import { Clipboard, House, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <House size={20} />,
    },
    {
      name: 'Pedidos',
      path: '/orders',
      icon: <Clipboard size={20} />,
    },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-linear-to-b from-purple-900 to-purple-800 text-white">
      <div className="border-b border-purple-700 p-6">
        <div className="flex-col items-center gap-3">
          <h1 className="text-lg font-bold">Amar Açaí</h1>
          <p className="text-xs text-purple-200">Gestão de Pedidos</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map(item => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-purple-100 hover:bg-purple-800'
                }`}
              >
                {item.icon}

                <span className="font-medium">{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-purple-700 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-purple-100 hover:bg-purple-800 hover:text-white"
        >
          <LogOut />
          Sair
        </Button>
      </div>
    </aside>
  );
}
