require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const loginRoutes = require('./routes/login');
const verifyOtpRoutes = require('./routes/verifyOtp');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
];

const uniqueOrigins = [...new Set(allowedOrigins)];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || uniqueOrigins.includes(origin)) {
        callback(null, origin || true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/login', loginRoutes);
app.use('/api/verify-otp', verifyOtpRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
