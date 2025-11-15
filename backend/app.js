import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './db/db.js';
import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import captainRoutes from './routes/captain.routes.js';
import maps from './routes/maps.routes.js';
import rideRoutes from './routes/ride.routes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', maps);
app.use('/rides', rideRoutes);
connectDB();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export {app};