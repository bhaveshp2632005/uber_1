import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/db.js';
import userRoutes from './routes/user.routes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
connectDB();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export {app};