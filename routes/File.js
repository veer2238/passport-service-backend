import File from "../models/FIle.js";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.post('/upload', async (req, res) => {
    const { name,mobile,dob,email,permanentadd,presentadd,pincode,institutename,education,currentstatus,techopted,duration,fees,pendingfees,referedby,photo,aadhar } = req.body; 
    try {
    const newFile = await File.create({
    
      name,
      dob,
      mobile,
      email,
      permanentadd,
      presentadd,
      pincode,
      institutename,
      education,
      currentstatus,
      techopted,
      duration,
      fees,
      pendingfees,
      referedby,
      photo,
      aadhar
    });
  
    // await newFile.save();
      console.log(newFile);
  
   
      // Load existing PDF
      // const existingPdfPath = './slip.pdf';
      // const existingPdfBytes = fs.readFileSync(existingPdfPath);
      // const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Modify existing PDF
      const currentDate = new Date();
      
  const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  const paidfees = fees-pendingfees
      // const page = pdfDoc.getPage(0);
      // page.drawText(name, { x: 105, y: 538, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(formattedDate, { x: 395, y: 542, size: 12, color: rgb(0, 0, 0) });
      // page.drawText(techopted, { x: 105, y: 413, size: 16, color: rgb(0, 0, 0) });
      // page.drawText(fees.toString(), { x: 490, y: 413, size: 16, color: rgb(0, 0, 0) });
      // page.drawText(fees.toString(), { x: 490, y: 236, size: 16, color: rgb(0, 0, 0) });
      // page.drawText(duefees.toString(), { x: 490, y: 208, size: 16, color: rgb(0, 0, 0) });
      // page.drawText(pendingfees.toString(), { x: 490, y: 177, size: 16, color: rgb(0, 0, 0) });
  
  
      
  
      
    //   const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS,
    //     },
    //   });
  
    //   const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: `Receipt for Your Registration | V-Ex Tech Solution`,
    //     html: `<div style="background-color: #f3f3f3; padding: 20px;">
    //     <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
    //         <h1 style="text-align: center; font-size: 24px; color: #333;">V-Ex Tech Solution</h1>
    //         <p style="color: #333; font-size: 18px;">${name}</p>
    //         <p style="color: #333; font-size: 16px;">Thank you for registering with us!</p>
    //         <p style="color: #333; font-size: 16px;">Below is your receipt:</p>
    //         <hr style="border: 1px solid #ccc;">
    //         <div style="margin-top: 20px;">
    //             <p style="color: #333; font-size: 16px;"><strong>Registration Details:</strong></p>
    //             <ul style="list-style-type: none; padding-left: 0;">
    //                 <li><strong>Student Name:</strong> ${name}</li><br>
    //                 <li><strong>Technology:</strong> ${techopted}</li><br>
    //                 <li><strong>Duration:</strong> ${duration}</li><br>
    //                 <li><strong>Total Amount:</strong> ${fees}</li><br>
    //                 <li><strong>Paid Amount:</strong> ${paidfees}</li><br>
    //                 <li style="color: red;"><strong>Pending Amount:</strong> ${pendingfees}</li><br>
    //                 <li><strong>Date:</strong> ${formattedDate}</li>
    //             </ul>
    //         </div>
    //         <hr style="border: 1px solid #ccc;">
    //         <p style="color: #333; font-size: 16px;">If you have any questions or concerns, feel free to contact us.</p>
    //         <p style="color: #666; font-size: 16px;">Best regards,</p>
    //         <p style="color: #666; font-size: 16px;">V-Ex Tech Solution Team</p>
    //         <div style="margin-top: 20px;">
    //             <a href="https://v-extechsolution.in" style="color: #3498db; font-size: 16px;">v-extechsolution.in</a><br><br>
    //             <a href="mailto:veeragraval@v-extechsolution.in" style="color: #3498db; font-size: 16px;">veeragraval@v-extechsolution.in</a><br><br>
    //             <a href="tel:9664768292" style="color: #3498db; font-size: 16px;">+91 9664768292</a>
    //         </div>
    //         <div style="margin-top: 20px;">
    //             <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;">
    //                 <img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="LinkedIn" style="width: 15%;">
    //             </a>
    //             <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;">
    //                 <img src="https://i.ibb.co/b60S7TZ/download.png" alt="YouTube" style="width: 15%;">
    //             </a>
    //             <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;">
    //                 <img src="https://i.ibb.co/xYLHv49/download.jpg" alt="Instagram" style="width: 15%;">
    //             </a>
    //         </div>
    //         <p style="color: #666; font-size: 16px; margin-top: 20px;">
    //             Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha, opp. Pavan Park Society, Nizampura, Vadodara, Gujarat 390002
    //         </p>
    //     </div>
    // </div>
    //  `,
  
      
    //   };
  
      
  
    
  
    
   
      
    //   const info = await transporter.sendMail(mailOptions);
    //   console.log('Email sent:', info.response);
  
  
     
  
      res.json({success:true,message:'Thanks registration details has been sent'});
   
    } catch (err) {
      console.error("Error saving file to database:", err);
      res.json({success:false,error:'Please try again'});
    }
  });
  
  
  app.get('/api/get-file-data', async (req, res) => {
    try {
      const fileData = await File.find(); // Retrieve all file data
      res.json(fileData);
    } catch (err) {
      console.error("Error fetching file data:", err);
      res.status(500).send("Error fetching file data");
    }
  });
  
  export default app