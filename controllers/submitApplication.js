const express = require('express');
const router = express.Router();
const applicationRoutes = require('../routes/applicationRoutes');
const { sendContactEmail } = require('../controllers/emailController');
const { submitApplication } = require('../controllers/applicationController');
const transporter = require('../config/email');

router.use('/applications', applicationRoutes);
router.post('/contact', sendContactEmail);

router.get('/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, 
      subject: 'Test Email from Backend',
      text: 'This is a test email from your backend server.'
    };
    
    await transporter.sendMail(testMailOptions);

    const dummyApplication = {
      jobId: '0',
      jobTitle: 'Test Job',
      firstName: 'John Doe',
      profession: 'Tester',
      mobile: '123456789',
      linkedin: 'https://www.linkedin.com/in/knwht/',
      cvText: 'This is a test CV text.',
      email: 'johndoe@example.com'
    };

    await submitApplication({ body: dummyApplication, file: null }, {
      status: () => ({ json: (data) => console.log('Simulated submitApplication:', data) })
    });

    res.json({ success: true, message: 'Sent successfully' });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send ' });
  }
});

module.exports = router;
