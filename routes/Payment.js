import express from "express";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import crypto from 'crypto';
import axios from 'axios'



dotenv.config();

const app = express();
const merchantId = process.env.MERCHANT_ID;
const saltKey = process.env.SALT_KEY;
const saltIndex = process.env.SALT_INDEX;
const frontendUrl = 'https://v-extechsolution.in/confirm';


app.post('/create-payment', async (req, res) => {
    const { amount,orderId,email} = req.body;
  
    try {
   
        const payload = {
          merchantId: merchantId,
          merchantTransactionId: orderId,
          merchantUserId:email,
          amount: amount*100,
          redirectMode: "REDIRECT",
          redirectUrl: `${frontendUrl}?orderId=${orderId}`,
          // callbackUrl: `${frontendUrl}/confirm`,
          // mobileNumber: user.mobile,
          paymentInstrument: {
              type: "PAY_PAGE"
          }
      };
  
       // Convert payload to JSON string
       const payloadString = JSON.stringify(payload);
  
             // Convert JSON string to Base64
      const base64Encoded = Buffer.from(payloadString).toString('base64');
      
  // for header
      const stringToHash = `${base64Encoded}/pg/v1/pay${saltKey}`;
  const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const finalXHeader = `${sha256Hash}###${saltIndex}`;
  
       // Prepare request to PhonePe
       const request = {
        request: base64Encoded
    };
  
    // Send request to PhonePe
         const response = await axios.post('https://api.phonepe.com/apis/hermes/pg/v1/pay', request, {
             headers: {
                 'Content-Type': 'application/json',
                 'X-VERIFY': finalXHeader
             }
         });
  
  
   // Check the response from PhonePe
   if (response.data.success) {
    
    res.json({
        success: true,
        data: response.data.data.instrumentResponse.redirectInfo.url,
        
    });
  } else {
    res.json({ success: false, error: "Failed to initiate payment" });
  }
        
      
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ success: false, error: error.message });
  }
  
  });

  app.post('/verify-payment', async (req, res) => {
    const { orderId, email, name, mobile } = req.body;  
  
    try {
      // Create the PhonePe check status URL
      const checkStatusUrl = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${orderId}`;
      
      // Generate the X-VERIFY header
      const stringToHash = `/pg/v1/status/${merchantId}/${orderId}${saltKey}`;
      const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
      const finalXHeader = `${sha256Hash}###${saltIndex}`;
      
      // Send the request to PhonePe to check the payment status
      const { data } = await axios.get(checkStatusUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': finalXHeader,
          'X-MERCHANT-ID':merchantId
        },
      });
  
    
      // Check the response from PhonePe
      if (data.success && data.code === 'PAYMENT_SUCCESS' && data.data.state === 'COMPLETED') {
        // Perform actions like saving the order, clearing the cart, etc.

       const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });
        // Process all users asynchronously
      
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `registration V-Ex Tech Solution`,
            html:  `Dear ${name},\n\nYour payment of ₹${data.data.amount / 100} was successful via ${mobile}. Your transaction ID is ${data.data.transactionId}. Thank you for your payment.\n\nBest regards,\nV-Ex Tech SOlution`,
          }
          
    
          const info = await transporter.sendMail(mailOptions);
          console.log(`Email sent:`, info.response);
        res.json({
          success: true,
          message: 'Payment successful',
          transactionId: data.data.transactionId, 
          paymentMethod: data.data.paymentInstrument.type, 
          amount: data.data.amount,
        });
      } else {
        res.json({ success: false, message: 'Payment failed or not completed.' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  export default app