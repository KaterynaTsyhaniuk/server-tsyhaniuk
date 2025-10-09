import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['https://katerynatsyhaniuk.github.io', 'http://localhost:5173'],
  }),
);
app.use(express.json());

// Використовуємо Brevo API
app.post('/send-email', async (req, res) => {
  const { email, comment } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: process.env.BREVO_USER },
        to: [{ email: process.env.EMAIL_TO }],
        subject: 'New Form Submission',
        textContent: `📬 New form submission:\n\nEmail: ${email}\nComment: ${comment}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Brevo API error: ${response.statusText}`);
    }

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
