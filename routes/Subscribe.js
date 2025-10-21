import express from 'express';
import Subscribe from '../models/Subscribe.js';
import nodemailer from 'nodemailer';

const app = express();

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
  
    const existingSubscription = await Subscribe.findOne({ email });
  
    if (existingSubscription) {
      return res
        .status(400)
        .json({ success: false, error: 'This email is already subscribed' });
    }
  
    try {
      const result = await Subscribe.create({
        email
      });
  
      console.log(result);

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          cc:'veer2238rajput@gmail.com',
          subject: "Subscription Confirmed - V-Ex Tech Solution",
          html: `
            <div style="background-color: #f8f8f8; padding: 20px; font-family: 'Arial', sans-serif; color: #333;">
              <p style="font-size: 18px; color: #007BFF;">Hi,</p>
              <p style="font-size: 16px;">Thank you for subscribing to V-Ex Tech Solution. We're excited to have you on board!</p>
        
              <img src="https://v-extechsolution.in/static/media/logo.b48612c02e688a28a62f.png" alt="Thank You Image" style="max-width: 100%; height: auto; margin-bottom: 20px;">
        
              <p style="font-size: 16px;">You'll now receive the latest updates and news from us.</p>
        
              <p style="font-size: 16px; margin-top: 20px;">Best regards,</p>
              <p style="font-size: 16px;">V-Ex Tech Solution Team</p>
            </div>
          `,
        });
    
        console.log('Subscription Email sent:', info.response);
  
      // Send success response
      res.status(200).json({
        success: true,
        message: 'Thanks Subscribed successfully',
      });
  
    } catch (error) {
      console.error('Subscription Error:', error);
      res
        .status(500)
        .json({ success: false, error: 'Failed to subscribe' });
    }
  });

export default app;