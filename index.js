const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const nodemailer = require('nodemailer');

const app = express();

mongoose
  .connect(
    "mongodb+srv://veer2238rajput:STrgrNlEXyfMZHBs@cluster0.3chkue4.mongodb.net/Contact?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  }
});

const User = mongoose.model("User", ContactSchema);

app.use(cors());
app.use(bodyParser.json());

app.post("/contact", async (req, res) => {
    const { name, email, dob } = req.body;
  
    try {
      const result = await User.create({ name, email, dob });
 
      res.json({ success: true, message: 'Contact added successfully' });
      console.log(result);
    } catch (error) {
      console.error("Error adding contact:", error);
      res.json({ success: false, error: 'Failed to add contact' });
    }
  });

  app.get("/mail", async (req, res) => {
    try {
      const users = await User.find();
  
      for (const user of users) {
        const userDob = new Date(user.dob);
        const today = new Date();
  
        if (userDob.getDate() === today.getDate() && userDob.getMonth() === today.getMonth()) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'veer2238rajput@gmail.com',
              pass: 'ngpb hgqv hztj cuuc'
            },
          });
  
          const mailOptions = {
            from: 'veer2238rajput@gmail.com',
            to: user.email,
            subject: 'Happy Birthday from VHX View',
            html: `
              <p>Happy Birthday, ${user.name}!</p>
              <p>Thank you for registering with VHX View. We hope you have a fantastic day!</p>
              <p>Best regards,</p>
              <p>VHX View Team</p>
            `,
          };
  
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.response);
        }
      }
  
      res.json({ success: true, message: 'Birthday emails sent successfully' });
    } catch (error) {
      console.error("Error sending birthday emails:", error);
      res.json({ success: false, error: 'Failed to send birthday emails' });
    }
  });
  



app.listen(3035, () => {
  console.log('Server connected');
});