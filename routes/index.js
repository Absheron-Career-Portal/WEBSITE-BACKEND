router.get('/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: `"Career Portal" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, 
      subject: 'Test Email from Backend',
      text: 'This is a test email from your backend server using Gmail.'
    };
    
    await transporter.sendMail(testMailOptions);
    res.json({ success: true, message: 'Test email sent successfully to cv@absheronport.az' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send test email' });
  }
});