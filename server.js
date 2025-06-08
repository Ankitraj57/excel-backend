const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', protectedRoutes);

app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
