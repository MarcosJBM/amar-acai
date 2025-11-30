import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import { DashboardPage } from './pages/dashboard';
import { LoginPage } from './pages/login';
import { OrdersPage } from './pages/orders';
import { useAppSelector } from './store/hooks';

function RootRedirect() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}
