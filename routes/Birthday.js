import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();


app.post('/birthwish', async (req, res) => {

    const {email,name} = req.body
  
  // console.log(email+name)
    try {
    
      
      // Fetch users whose birthday is today
      // const users = await File.findOne({email});
      
      // Create the transporter once
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      // Process all users asynchronously
    
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `V-Ex Tech Solution! - 🎉 Happy Birthday ${name} 🎂`,
          html:  `
          <img src="https://i.ibb.co/xYYx4KL/Untitled-13.png" alt="Untitled-13" border="0" style="width:100%;">
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;"> Happy Birthday,<br>${name}! 🎂 <br> from</h1>
      <img src="https://v-extechsolution.in/static/media/logo.b48612c02e688a28a62f.png" alt="Birthday Image" style="width: 70%; border-radius: 10px; margin-bottom: 20px;">
      <p style="color: #666; font-size: 16px; line-height: 1.5;">Wishing you a day filled with happiness and a year filled with joy. Thank you for being a part of V-Ex Tech Solution!</p>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">"Count your life by smiles, not tears. Count your age by friends, not years. Happy birthday!"</p>
  
      <p style="color: #666; font-size: 16px; line-height: 1.5;">Best regards,</p>
      <p style="color: #666; font-size: 16px; line-height: 1.5;">V-Ex Tech Solution Team</p>
      <div style="margin-top: 50px; color: #666;">
      <a href="https://v-extechsolution.in" style="font-size: 16px; line-height: 1.5;">v-extechsolution.in</a><br>
      <a href="mailto:veeragraval@v-extechsolution.in" style="font-size: 16px; line-height: 1.5;">veeragraval@v-extechsolution.in</a><br>
      <a href="tel:9664768292" style="font-size: 16px; line-height: 1.5;">+91 9664768292</a>
  <div style="margin-top: 50px;">
      <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="download-1" border="0" style="width:15%"></a>
      <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/b60S7TZ/download.png" alt="download-1" border="0" style="width:15%"></a>
      <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/xYLHv49/download.jpg" alt="download-1" border="0" style="width:15%"></a>
    </div>
    </div>
    <p style="color: #666; font-size: 16px; line-height: 1.5; margin-top: 20px;">Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha, opp. pavan park society, Nizampura, Vadodara, Gujarat 390002</p>
    </div>
          `,
        }
        
  
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent:`, info.response);
      
      
      console.log('Birthday emails sent successfully');
     res.json({ success: true, message: 'Birthday emails sent successfully' });
  
    } catch (error) {
      console.error('Error sending birthday emails:', error);
    
      res.json({ success: false, message: 'please try again' });
    }
  });


  export default app