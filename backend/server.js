import http from 'http';
import { app } from "./app.js";
import dotenv from 'dotenv';
// const { initializeSocket } = require('./socket');
import { initializeSocket } from './socket.js';

dotenv.config();

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

initializeSocket(server);
server.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`); 
});