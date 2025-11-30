import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production'], {
    error: 'NODE_ENV must be development, test or production',
  }),
  PORT: z.coerce.number({ error: 'PORT must be a number' }).int(),
  DATABASE_URL: z.string({ error: 'DATABASE_URL is required' }),
  JWT_SECRET: z
    .string({ error: 'JWT_SECRET is required' })
    .min(32, 'JWT_SECRET must be at least 32 characters long'),
});

const result = envSchema.safeParse(process.env);

if (result.success === false) {
  console.error('Invalid environment variables', z.treeifyError(result.error));

  throw new Error('Invalid environment variables.');
}

export const env = result.data;
