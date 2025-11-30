import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import { env } from '@/env';
import { PrismaClient } from '@/generated/prisma';

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});
