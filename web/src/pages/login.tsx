import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export function LoginPage() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [login, { isLoading, error: apiError }] = useLoginMutation();

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    try {
      const result = await login({ username, password }).unwrap();
      dispatch(setCredentials({ token: result.token, userId: result.userId }));
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-50 to-white p-4">
      <Card className="w-full max-w-md border-purple-200 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-3xl font-bold text-purple-900">
            Amar Açaí
          </CardTitle>

          <CardDescription className="text-base">
            Sistema de Gestão de Pedidos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={event => void handleLogin(event)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Usuário
              </Label>

              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={event => setUsername(event.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            {apiError && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {'data' in apiError &&
                typeof apiError.data === 'object' &&
                apiError.data &&
                'message' in apiError.data
                  ? String(apiError.data.message)
                  : 'Usuário ou senha incorretos'}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-purple-600 to-purple-500 py-6 font-semibold text-white shadow-lg hover:from-purple-700 hover:to-purple-600 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
