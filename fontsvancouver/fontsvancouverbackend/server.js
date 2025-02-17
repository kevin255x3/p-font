const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Test the email connection
transporter.verify(function (error, success) {
    if (error) {
        console.log('Email verification error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Submission endpoint
app.post('/api/submit', upload.single('image'), async (req, res) => {
    try {
        const { artist, location, email } = req.body;
        const imageFile = req.file;

        if (!artist || !location || !imageFile) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Configure email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.DESTINATION_EMAIL,
            subject: 'New Font Location Submission',
            html: `
        <h2>New Location Submission</h2>
        <p><strong>Artist:</strong> ${artist}</p>
        <p><strong>Location:</strong> ${location}</p>
        ${email ? `<p><strong>Contact Email:</strong> ${email}</p>` : ''}
      `,
            attachments: [
                {
                    filename: imageFile.originalname,
                    content: imageFile.buffer,
                    contentType: imageFile.mimetype
                }
            ]
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Submission successful' });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Failed to process submission' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});