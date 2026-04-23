import express from "express";
import Completion from "../models/Completion.js";
import nodemailer from 'nodemailer';
import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";




const app = express();




const generatePDFBuffer = async (data) => {
  const existingPdfBytes = fs.readFileSync("templates/Completion_Letter.pdf");

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const toTitleCase = (text) => {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

  // 👉 Example: Date on right
  const dateText = `Date: ${data.completiondate}`;
  const fontSize = 12;

  const textWidth = font.widthOfTextAtSize(dateText, fontSize);

  let dateY = height - 225; 

  page.drawText(dateText, {
    x: width - textWidth - 50,
    y: dateY,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });


  // 👉 Left side "To" section
const leftX = 50;   // margin from left
let startY = dateY - 50; 



page.drawText("To,", {
  x: leftX,
  y: startY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

let currentY = startY - 20;



page.drawText("The Head of Department", {
  x: leftX,
  y: currentY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

let nextY = currentY - 15;

const collegeName = data.collegename.toUpperCase();

page.drawText(collegeName, {
  x: leftX,
  y: nextY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});

let BranchY = nextY - 15;

const branchText =data.branch.toUpperCase();

page.drawText(branchText, {
  x: leftX,
  y: BranchY,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});


let GreetingY = BranchY - 30;

page.drawText("Dear Sir/Madam", {
    x: leftX,
    y: GreetingY,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  const bodyY = GreetingY - 30;
  const upperbranch = data.branch.toUpperCase();

  const bodyText = `This is to certify that ${toTitleCase(data.name)} (Enrollment Number: ${data.enrollment}), a student of ${toTitleCase(data.collegename)}, pursuing ${upperbranch}, has successfully completed an internship in the domain of ${toTitleCase(data.domain)} at V-Ex Tech Solutions from ${data.startdate} to ${data.enddate}.`;

 page.drawText(bodyText, {
  x: leftX,
  y: bodyY,
  size: fontSize,
  font,
  color: rgb(0, 0, 0),
  maxWidth: 500,    
  lineHeight: fontSize + 5,
});

const secondBodyY = bodyY - 80;

const secondBodyText = `During this period, the candidate was actively involved in various practical and project-based tasks related to their domain, including research, implementation, and real-world problem-solving activities. The internship provided exposure to industry practices, tools, and methodologies relevant to the field. `;

page.drawText(secondBodyText, {
  x: leftX,
  y: secondBodyY,
  size: fontSize,
  font,
  color: rgb(0, 0, 0),
  maxWidth: 500,    
  lineHeight: fontSize + 5,
});

const thirdBodyY = secondBodyY - 80;

const thirdBodyText = `${toTitleCase(data.name)} demonstrated strong analytical skills, dedication, and a willingness to learn. Their performance throughout the internship was commendable, and they consistently showed professionalism, teamwork, and a positive attitude.`;

page.drawText(thirdBodyText, {
  x: leftX,
  y: thirdBodyY,
  size: fontSize,
  font,
  color: rgb(0, 0, 0),
  maxWidth: 500,    
  lineHeight: fontSize + 5,
});

const fourthBodyY = thirdBodyY - 80;

const fourthBodyText = `We appreciate their contribution to our organization and are confident that the experience gained during this internship will support their future academic and professional endeavors. We wish them all the best for their future career`;

page.drawText(fourthBodyText, {
  x: leftX,
  y: fourthBodyY,
  size: fontSize,
  font,
  color: rgb(0, 0, 0),
  maxWidth: 500,    
  lineHeight: fontSize + 5,
});


// 📐 Layout settings
const marginRight = 50;
const footerY = 40;

const qrSize = 50;
const gap = 8; // spacing between elements

// 👉 Generate cert number

const certText = `Certificate No: ${data.certNo}`;

// 👉 QR URL
const verifyURL = `https://v-extechsolution.in/certi-details?cert=${data.certNo}`;
const qrImageBuffer = await QRCode.toBuffer(verifyURL);
const qrImage = await pdfDoc.embedPng(qrImageBuffer);

// 👉 QR position (RIGHT ALIGNED)
const qrX = width - qrSize - marginRight;
const qrY = footerY;

// Draw QR
page.drawImage(qrImage, {
  x: qrX,
  y: qrY,
  width: qrSize,
  height: qrSize,
});

// 👉 "Scan to Verify" (centered under QR)
const label = "Scan to Verify";
const labelSize = 8;
const labelWidth = font.widthOfTextAtSize(label, labelSize);

page.drawText(label, {
  x: qrX + (qrSize - labelWidth) / 2,
  y: qrY - 12,
  size: labelSize,
  font,
});

// 👉 Certificate number (above QR, aligned to RIGHT)
const certSize = 10;
const certWidth = font.widthOfTextAtSize(certText, certSize);

page.drawText(certText, {
  x: width - certWidth - marginRight,
  y: qrY + qrSize + gap,
  size: certSize,
  font,
  color: rgb(0.4, 0.4, 0.4),
});

  const pdfBytes = await pdfDoc.save();



 return Buffer.from(pdfBytes);
};

app.post("/completion", async (req, res) => {

    const certNo = `VEX-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    try {
    const {
      name,
      enrollment,
      collegename,
      branch,
      domain,
      email,
      startdate,
      enddate,
      completiondate
    } = req.body;


    console.log(req.body);

    
     const work = `This is to officially verify that ${name} has successfully completed an internship in the domain of ${domain} with V-Ex Tech Solutions. The certificate associated with ID ${certNo} is valid and was issued on ${completiondate}. This verification confirms the authenticity of the certificate.`;

    const newData = new Completion({
      name,
      enrollment,
      collegename,
      branch,
      domain,
      email,
      startdate,
      enddate,
      completiondate,
    certiId: certNo,
        work
    });

       const result = await newData.save();
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

        const templatePath = path.resolve("templates/completionEmail.html");
        let html = fs.readFileSync(templatePath, "utf-8");
        html = html
  .replace(/{{name}}/g, name)
  .replace(/{{enrollment}}/g, enrollment)
  .replace(/{{collegename}}/g, collegename)
  .replace(/{{branch}}/g, branch)
  .replace(/{{domain}}/g, domain)
  .replace(/{{startdate}}/g, startdate)
  .replace(/{{enddate}}/g, enddate)
  .replace(/{{completiondate}}/g, completiondate);

  const pdfBuffer = await generatePDFBuffer({
  name,
  enrollment,
  collegename,
  branch,
  domain,
  startdate,
  enddate,
  completiondate,
  certNo 
});



        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            cc: process.env.EMAIL_CC,
            subject: "Internship Completion Letter from V-Ex Tech Solution",
            html: html,
            attachments: [
 {
      filename: `Completion_Letter_${name}.pdf`,
      content: pdfBuffer,   
      contentType: "application/pdf",
    },
]
          });

           console.log("Message sent:", info.messageId);


        

    
  

 

    res.json({
      success: true,
      message: "Completion letter has been sent successfully",
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server Error"
    });
  }
});


  
  app.post('/certi-details', async(req, res) => {
    try {
      const { certiid } = req.body;
  
      const certiDetails = await Completion.findOne({ certiId:certiid });
  
      if (!certiDetails) {
        return res.json({ success: false, message: 'Certificate details not found' });
      }
  
      res.json({ success: true, data: certiDetails });
    } catch (error) {
      console.error('Error processing certification ID:', error);
      res.json({ success: false, message: 'Failed to process certification ID' });
    }
  });





export default app;
