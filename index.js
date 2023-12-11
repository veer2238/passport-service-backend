import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import nodemailer from "nodemailer"

const app = express()

app.use(cors());
app.use(bodyParser.json());

app.post('/', async (req, res) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'veer2238rajput@gmail.com',
          pass: 'jeasqtbfommzmxya'
        },
      });
  
    
  
      let info = await transporter.sendMail({
        from: 'veer2238rajput@gmail.com',
        to: 'himanshu0409agraval@gmail.com',
        subject: "thanks for registration",
        text: "Hello world?",
        html: `<p>Hi ${req.body.name},</p>
                <p>Thank you for attending the lecture on ${req.body.date}. </p>
                <p>Here are the details of your work:</p>
                <p><strong>Work:</strong> ${req.body.work}</p>
                <p>We appreciate your dedication and hard work!</p>
                <img src="https://i.ibb.co/gyh8tYH/Untitled.png" alt="Thank You Image" style="max-width: 100%; height: auto;">
                <p>Best regards,</p>
                <p>V-Ex Tech Solution</p>`
      
      });

     
  
      console.log("Message sent: %s", info.messageId);
  
     // Respond with success
     
     res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Attendance Error:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });


  app.post('/contact', async (req, res) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: 'veer2238rajput@gmail.com',
          pass: 'jeasqtbfommzmxya'
        },
      });
  
    
  
      let info = await transporter.sendMail({
        from: 'veer2238rajput@gmail.com',
        to: req.body.email,
        cc:'himanshu0409@gmail.com',
        subject: "thanks for Contacting at V-Ex Tech Solution",
         html: `
         <p>Hi ${req.body.name},</p>
         <p>Thank you for contacting V-Ex Tech Solution. We have received your query and will get back to you soon.</p>
         <p>we have Your contact details:</p>
         <p><strong>Email:</strong> ${req.body.email}</p>
         <p><strong>Phone:</strong> ${req.body.phone}</p>

         <img src="https://i.ibb.co/gyh8tYH/Untitled.png" alt="Thank You Image" style="max-width: 100%; height: auto;">
         <p>In the meantime, feel free to call us at +91 9664768292. We look forward to assisting you!</p>
         <p>Best regards,</p>
         <p>V-Ex Tech Solution</p>
         <p>301,DHUN COMPLEX,ABOVE</p>
         <p>RIYA BRIDAL,NIZAMPURA MAIN ROAD</p>
         <p>NEAR AMRITSARI KULCHA</p>
         <p>VADODARA,GUJARAT-390002.</p>
         <p>v-extechsolution.in</p>

     `

      });



     
  
      console.log("Message sent: %s", info.messageId);
  
     // Respond with success
     
     res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Attendance Error:', error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  });

const port =9000

app.listen(port,() =>{
    console.log("server connected")
})