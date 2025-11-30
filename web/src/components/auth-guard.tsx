import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useAppSelector } from '@/store/hooks';

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
