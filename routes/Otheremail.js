import express from "express";
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";





const app = express();






 app.post('/other-mail', async (req, res) => {
    const { email,name, subject, message } = req.body;

    console.log(email,name, subject, message);
    // try {
    //   const fileData = await File.findById(id);
    //   if (!fileData) {
    //     return res.json({ success: false, message: "File not found" });
    //   }
    //   const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     secure: true,
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   });
    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: fileData.email,
    //     cc: "veer2238rajput@gmail.com",
    //     subject: subject,
    //     html:other.replace(/{{name}}/g, fileData.name)
    //       .replace(/{{message}}/g, message),
    //   };
    //   const info = await transporter.sendMail(mailOptions);
    //   console.log('Email sent:', info.response);
    //   res.json({ success: true, message: "Thanks Email sent successfully" });
    // } catch (err) {
    //   console.error("Error sending email:", err);
    //   res.status(500).send("Error sending email");
    // }
   
  });

  
 





export default app;
