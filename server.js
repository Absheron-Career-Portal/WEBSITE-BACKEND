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

// === CORS (mütləq ən yuxarıda) ===
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://career.absheronport.az');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

// =====================
//  API ROUTE-LAR
// =====================

// Müraciət siyahısı
app.get('/api/applications/all', getApplications);

// Müraciət göndərmə (CV upload ilə)
app.post(
  '/api/applications/submit',
  upload.single('cv'),
  validateApplication,
  submitApplication
);

// Kontakt forması
app.post('/api/contact', sendContactEmail);

// Test email (istəsən saxla)
app.get('/api/test-email', async (req, res) => {
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
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send test email' });
  }
});

// Sağlamlıq yoxlama
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});