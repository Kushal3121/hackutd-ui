import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import { initUsers } from './models/userModel.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/', authRoutes);
app.use('/api/cars', carRoutes);

app.use((req, res) => res.status(404).json({ error: 'route not found' }));

const PORT = process.env.PORT || 3000;

const start = async () => {
  await initUsers();
  app.listen(PORT, () =>
    console.log(`API running at http://localhost:${PORT}`)
  );
};

start();
