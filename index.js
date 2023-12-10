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
        html: "my name is " +req.body.name + "<br>" +"i attend "+ req.body.date +" lecture"+ "<br>" +"my work:"+ req.body.work
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