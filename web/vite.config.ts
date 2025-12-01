import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { z } from 'zod';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const schema = z.object({
    VITE_API_URL: z.string().url({
      message: 'A variável VITE_API_URL precisa ser uma URL válida.',
    }),
  });

  const parsed = schema.safeParse(env);

  if (!parsed.success) {
    console.error('Erro nas variáveis de ambiente (.env):');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
