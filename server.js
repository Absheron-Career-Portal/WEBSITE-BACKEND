// require('dotenv').config(); 

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');
// const routes = require('./routes');

// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// app.use('/uploads', express.static('uploads'));
// app.use('/api', routes);

// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });















// // server.js
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');
// const routes = require('./routes');

// // === DB-ə qoşulma ===
// connectDB();

// const app = express();

// // === CORS ayarları (ƏSAS HİSSƏ) ===
// const corsOptions = {
//   origin: [
//     'https://career.absheronport.az', // production frontend
//     'http://localhost:5173',          // (istəsən dev üçün saxla)
//     'http://localhost:3000'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// // Preflight və normal request-lər üçün
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // === Body parsers ===
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // === Static files ===
// app.use('/uploads', express.static('uploads'));

// // === API routeları ===
// app.use('/api', routes);

// // === Sağlamlıq yoxlama route-u ===
// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

// // === Serveri işə sal ===
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });








// // server.js
// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');
// const routes = require('./routes');

// // === DB-ə qoşulma ===
// connectDB();

// const app = express();

// // === Sadə log middleware (hansı URL-ə request gəldiyini görmək üçün) ===
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

// // === CORS (hamıya icazə ver – problem diaqnostikası üçün kifayətdir) ===
// app.use(cors());
// app.options('*', cors());

// // === Body parsers ===
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // === Static fayllar ===
// app.use('/uploads', express.static('uploads'));

// // === API routeları ===
// app.use('/api', routes);

// // === Sağlamlıq yoxlama route-u ===
// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Server is running' });
// });

// // === 404 handler (bütün tapılmayan routelarda JSON qaytaracaq) ===
// app.use((req, res) => {
//   console.log(`404 NOT FOUND: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({
//     message: 'Route not found',
//     path: req.originalUrl,
//   });
// });

// // === Serveri işə sal ===
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const routes = require('./routes');

// === DB-ə qoşulma ===
connectDB();

const app = express();

// === CORS-u özümüz yazırıq (hamı üçün keçərlidir) ===
app.use((req, res, next) => {
  // Sənin front domenin:
  res.header('Access-Control-Allow-Origin', 'https://career.absheronport.az');
  // Lazım olan metodlar:
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // Gözlənilən header-lar:
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Preflight (OPTIONS) request gəlibsə, burda bitiririk
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// === Body parsers ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === Static fayllar ===
app.use('/uploads', express.static('uploads'));

// === API routeları ===
app.use('/api', routes);

// === Sağlamlıq yoxlama route-u ===
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// === 404 handler (Express-ə düşən amma tapılmayan, məsələn GET /) ===
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// === Serveri işə sal ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});