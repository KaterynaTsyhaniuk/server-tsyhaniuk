import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();
const app = express();
const PORT = 3000;

// Explicit CORS configuration
const corsOptions = {
  origin: ['https://katerynatsyhaniuk.github.io', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔹 Transporter для Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true для 465, false для 587
  auth: {
    user: process.env.BREVO_USER, // твій Login (85599a001@smtp-brevo.com)
    pass: process.env.BREVO_PASS, // SMTP ключ (наприклад NodeJs109...)
  },
});

app.post('/send-email', async (req, res) => {
  const { email, comment } = req.body;

  const mailOptions = {
    from: process.env.BREVO_USER,
    to: process.env.EMAIL_TO, // Куди надсилати (твоя основна пошта)
    subject: 'New Form Submission',
    text: `📬 New form submission:\n\nEmail: ${email}\nComment: ${comment}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ title: 'Success!', message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ title: 'Error', message: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
