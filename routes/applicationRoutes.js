const express = require('express');
const router = express.Router();
const { submitApplication, getApplications } = require('../controllers/applicationController');
const { validateApplication } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.post('/submit', upload.single('cv'), validateApplication, submitApplication);
router.get('/all', getApplications);

module.exports = router;