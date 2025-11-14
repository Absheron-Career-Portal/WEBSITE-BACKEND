require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');

// CONTROLLER və MIDDLEWARE-lər
const { submitApplication, getApplications } = require('./controllers/applicationController');
const { validateApplication } = require('./middleware/validation');
const upload = require('./middleware/upload');
const { sendContactEmail } = require('./controllers/emailController');
const transporter = require('./config/email');

// === DB-ə qoşulma ===
connectDB();

const app = express();


// ===================================================================================
// ⭐ 1) CORS (ƏN YUXARIDA) + PRE-FLIGHT LOG
// ===================================================================================
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://career.absheronport.az');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // CORS yoxlaması üçün log
  console.log(`[CORS] ${req.method} -> ${req.originalUrl}`);

  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Preflight (OPTIONS) ACCEPTED for ${req.originalUrl}`);
    return res.sendStatus(200);
  }

  next();
});


// ===================================================================================
// ⭐ 2) GLOBAL REQUEST LOGGER – HƏR REQUEST-İ GÖRƏCƏKSƏN
// ===================================================================================
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});


// ===================================================================================
// ⭐ 3) Body parsers
// ===================================================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// ===================================================================================
// ⭐ 4) Static Files
// ===================================================================================
app.use('/uploads', express.static('uploads'));


// ===================================================================================
// ⭐ 5) API ROUTE-LAR (tam log ilə)
// ===================================================================================

// Müraciət siyahısı
app.get('/api/applications/all', (req, res, next) => {
  console.log(`[ROUTE] GET /api/applications/all`);
  next();
}, getApplications);


// Müraciət göndərmə (CV upload ilə)
app.post(
  '/api/applications/submit',
  (req, res, next) => {
    console.log(`[ROUTE] POST /api/applications/submit`);
    next();
  },
  upload.single('cv'),
  validateApplication,
  submitApplication
);


// Kontakt forması
app.post('/api/contact', (req, res, next) => {
  console.log(`[ROUTE] POST /api/contact`);
  next();
}, sendContactEmail);


// Test email
app.get('/api/test-email', async (req, res) => {
  console.log(`[ROUTE] GET /api/test-email`);

  try {
    const testMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Backend',
      text: 'This is a test email from your backend server.'
    };

    await transporter.sendMail(testMailOptions);
    res.json({ success: true, message: 'Test email sent successfully' });

  } catch (error) {
    console.error('[ERROR] Test email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send test email' });
  }
});


// Sağlamlıq yoxlama
app.get('/health', (req, res) => {
  console.log(`[ROUTE] GET /health`);
  res.status(200).json({ message: 'Server is running' });
});


// ===================================================================================
// ⭐ 6) 404 Handler (TAM LOG İLƏ)
// ===================================================================================
app.use((req, res) => {
  console.log(`[404] Route not found: ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});


// ===================================================================================
// ⭐ 7) Server start
// ===================================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});