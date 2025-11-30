import cors from 'cors';
import express from 'express';

import { env } from './env';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRoutes } from './routes/auth.routes';
import { orderRoutes } from './routes/order.routes';
import { salesRoutes } from './routes/sales.routes';
import { userRoutes } from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, response) =>
  response.status(200).json({ message: 'API is running', version: '1.0.0' }),
);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/sales', salesRoutes);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
