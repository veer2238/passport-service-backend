// index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
  .connect(
    "mongodb+srv://veer2238rajput:STrgrNlEXyfMZHBs@cluster0.3chkue4.mongodb.net/Contact?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log("mongo error", err));

const attendaceSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  work: {
    type: String,
    require: true,
  },
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("Attend", attendaceSchema);
const ContactUser = mongoose.model("Contact", contactSchema);

app.use(cors());
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { name, date, work } = req.body;

  const existingRecord = await User.findOne({ name, date });

  if (existingRecord) {
    return res
      .status(400)
      .json({ success: false, error: "Your record already exists" });
  }

  try {
    const result = await User.create({
      name,
      date,
      work,
    });

    console.log(result);

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Attendance record added successfully" });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "himanshu0409agraval@gmail.com", // Replace with the recipient's email
      subject: "New Attendance Record",
      html: `
        <p>Hello,</p>
        <p>A new attendance record has been added:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Work:</strong> ${work}</p>
        <p>Best regards,</p>
        <p>V-Ex Tech Solution</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Attendance Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add attendance record" });
  }
});

app.post("/contact", async (req, res) => {
  const body = req.body;

  const result = await ContactUser.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    message: body.message,
  });

  console.log(result);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      cc: "himanshu0409agraval@gmail.com",
      subject: "Thanks for Contacting at V-Ex Tech Solution",
      html: `
         <p>Hi ${req.body.name},</p>
         <p>Thank you for contacting V-Ex Tech Solution. We have received your query and will get back to you soon.</p>
         <p>We have your contact details:</p>
         <p><strong>Email:</strong> ${req.body.email}</p>
         <p><strong>Phone:</strong> ${req.body.phone}</p>

         <img src="https://i.ibb.co/gyh8tYH/Untitled.png" alt="Thank You Image" style="max-width: 100%; height: auto;">
         <p>In the meantime, feel free to call us at +91 9664768292. We look forward to assisting you!</p>
         <p>Best regards,</p>
         <p>V-Ex Tech Solution</p>
         <p>301, DHUN COMPLEX, ABOVE</p>
         <p>RIYA BRIDAL, NIZAMPURA MAIN ROAD</p>
         <p>NEAR AMRITSARI KULCHA</p>
         <p>VADODARA, GUJARAT-390002.</p>
         <p>v-extechsolution.in</p>
     `,
    });

    console.log("Message sent:", info.messageId);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Contact Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send email" });
  }
});

const port = 9000;

app.listen(port, () => {
  console.log("server connected");
});
