import express from 'express';
import Subscribe from '../models/Subscribe.js';

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