const express = require('express');
const router = express.Router();
const applicationRoutes = require('./applicationRoutes');
const { sendContactEmail } = require('../controllers/emailController');
const transporter = require('../config/email');

router.use('/applications', applicationRoutes);
router.post('/contact', sendContactEmail);

router.get('/test-email', async (req, res) => {
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

module.exports = router;