const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const authRoutes    = require('./routes/auth');
const recordRoutes  = require('./routes/records');
const creditRoutes  = require('./routes/credits');
const debitRoutes   = require('./routes/debits');

const app = express();

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS blocked for origin: ' + origin));
  },
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/credits', creditRoutes);
app.use('/api/debits',  debitRoutes);

app.get('/', (req, res) => res.json({ message: 'விழா மேலாண்மை API Running ✅' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI. Add it to .env (root or server folder).');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('🚀 Server running on port', process.env.PORT || 5000)
    );
  })
  .catch(err => { console.error('MongoDB Error:', err); process.exit(1); });
