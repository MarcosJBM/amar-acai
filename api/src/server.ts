import express from 'express';

import { env } from './env';

const app = express();

app.use(express.json());

// Requisição simples para testar acesso à API.
app.get('/', (_, response) =>
  response.status(200).send({ message: 'Up to go!' }),
);

app.listen(env.PORT, () => {
  console.log('Servidor escutando...');
});
