const validateApplication = (req, res, next) => {
  const { firstName, email, jobId, profession } = req.body;

  if (!firstName || !email || jobId === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if ((jobId === 0 || jobId === '0') && !profession) {
    return res.status(400).json({ error: 'Profession is required for general CV applications' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

module.exports = { validateApplication };
