import ContactUser from '../models/Contact.js'
import express from "express";
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";




const app = express();



app.post("/contact", async (req, res) => {
    const {name,email,phone,message} = req.body;
    console.log(name,email,phone,message)
  try{
    const exist = await ContactUser.findOne({ email });
    if(exist){
      return res.json({success:false,message:'you have already enquired about the same issue'})
    }
    const result = await ContactUser.create({
      name,
      email,
      phone,
      message
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


    const templatePath = path.join(process.cwd(), "templates/contact-email.html");

let html = fs.readFileSync(templatePath, "utf-8");

html = html
  .replace("{{name}}", name)
  .replace("{{email}}", email)
  .replace("{{phone}}", phone)
  .replace("{{message}}", message);
  
      const info = await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  cc: process.env.EMAIL_CC,
  subject: "Thanks for contacting V-Ex Tech Solution",
  html: html,
});
    
      
  
      console.log("Message sent:", info.messageId);
      res.json({success:true,message:' Thanks Your message has been sent'})
  
    } catch (error) {
      console.error("Contact Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  });

  app.get("/enquiry", async (req, res) => {
    try {
      const allEnquiryData = await ContactUser
   
      .find()
      .sort({ createdAt: -1 })
      res.status(200).json(allEnquiryData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.post("/enquiry-delete", async (req, res) => {
    const {id} = req.body;
   
  try{
    const deletedEnquiry = await ContactUser.findByIdAndDelete(id);

    if (deletedEnquiry) {
      res.json({ success: true, message: 'Enquiry deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: "Enquiry not found" });
    }
  
    } catch (error) {
      console.error("Contact Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to send message" });
    }
  });

  export default app

