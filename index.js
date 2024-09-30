import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import axios from 'axios'
import Contactroute from './routes/Contact.js';





dotenv.config();

const app = express();
const port = 9000;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://veer2238rajput:STrgrNlEXyfMZHBs@cluster0.3chkue4.mongodb.net/Contact?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));



  const merchantId = process.env.MERCHANT_ID;
const saltKey = process.env.SALT_KEY;
const saltIndex = process.env.SALT_INDEX;
const frontendUrl = 'https://v-extechsolution.in/confirm';

 const fileSchema = new mongoose.Schema({
 name: String,
  mobile: Number,
  dob: Date,
  email: String,
  permanentadd: String,
  presentadd: String,
  pincode: String,
  institutename:String,
  education:String,
  currentstatus:String,
  techopted:String,
  duration:String,
  fees:Number,
  pendingfees:Number,
  referedby:String,
  photo:String,
  aadhar:String,
  createdAt: { type: Date, default: Date.now }
});

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
const passportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  idType: {
    type: String,
    required: true,
    enum: ['aadhar', 'pan', 'passport', 'voter','driving','students','other'], // Ensure the value is one of these options
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
});







const certiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: String, // Assuming you want to store Date of Birth as a string
    required: true,
  },
  startDate: {
    type: String, // Assuming you want to store Start Date as a string
    required: true,
  },
  endDate: {
    type: String, // Assuming you want to store End Date as a string
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  certiId: {
    type: String,
    required: true,
  },
});


  
  const File = mongoose.model('File', fileSchema);
  const Certi = mongoose.model('Certificate', certiSchema);

const User = mongoose.model("Attend", attendaceSchema);


const Passport = mongoose.model('passport', passportSchema);
  
app.use(cors());

app.use('/',Contactroute)

app.use(bodyParser.json());

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


    

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Receipt for Your Registration | V-Ex Tech Solution`,
      html: `<div style="background-color: #f3f3f3; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
          <h1 style="text-align: center; font-size: 24px; color: #333;">V-Ex Tech Solution</h1>
          <p style="color: #333; font-size: 18px;">${name}</p>
          <p style="color: #333; font-size: 16px;">Thank you for registering with us!</p>
          <p style="color: #333; font-size: 16px;">Below is your receipt:</p>
          <hr style="border: 1px solid #ccc;">
          <div style="margin-top: 20px;">
              <p style="color: #333; font-size: 16px;"><strong>Registration Details:</strong></p>
              <ul style="list-style-type: none; padding-left: 0;">
                  <li><strong>Student Name:</strong> ${name}</li><br>
                  <li><strong>Technology:</strong> ${techopted}</li><br>
                  <li><strong>Duration:</strong> ${duration}</li><br>
                  <li><strong>Total Amount:</strong> ${fees}</li><br>
                  <li><strong>Paid Amount:</strong> ${paidfees}</li><br>
                  <li style="color: red;"><strong>Pending Amount:</strong> ${pendingfees}</li><br>
                  <li><strong>Date:</strong> ${formattedDate}</li>
              </ul>
          </div>
          <hr style="border: 1px solid #ccc;">
          <p style="color: #333; font-size: 16px;">If you have any questions or concerns, feel free to contact us.</p>
          <p style="color: #666; font-size: 16px;">Best regards,</p>
          <p style="color: #666; font-size: 16px;">V-Ex Tech Solution Team</p>
          <div style="margin-top: 20px;">
              <a href="https://v-extechsolution.in" style="color: #3498db; font-size: 16px;">v-extechsolution.in</a><br><br>
              <a href="mailto:veeragraval@v-extechsolution.in" style="color: #3498db; font-size: 16px;">veeragraval@v-extechsolution.in</a><br><br>
              <a href="tel:9664768292" style="color: #3498db; font-size: 16px;">+91 9664768292</a>
          </div>
          <div style="margin-top: 20px;">
              <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;">
                  <img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="LinkedIn" style="width: 15%;">
              </a>
              <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;">
                  <img src="https://i.ibb.co/b60S7TZ/download.png" alt="YouTube" style="width: 15%;">
              </a>
              <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;">
                  <img src="https://i.ibb.co/xYLHv49/download.jpg" alt="Instagram" style="width: 15%;">
              </a>
          </div>
          <p style="color: #666; font-size: 16px; margin-top: 20px;">
              Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha, opp. Pavan Park Society, Nizampura, Vadodara, Gujarat 390002
          </p>
      </div>
  </div>
   `,

    
    };

    

  

  
 
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);


   

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

   
  } catch (error) {
    console.error("Attendance Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add attendance record" });
  }
});





app.get("/attendance", async (req, res) => {
  try {
    const allAttendanceData = await User.find();
    res.status(200).json(allAttendanceData);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






app.get("/attendance/search", async (req, res) => {
  const { name } = req.query;

  try {
    const result = await User.find({ name: new RegExp(name, "i") });

    res.status(200).json(result);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, error: "Failed to search records" });
  }
});


app.post('/certi', async (req, res) => {
  const { name, dob, startDate, endDate, work,certiId} = req.body;

  const existingRecord = await Certi.findOne({ name,dob,certiId});

  if (existingRecord) {
    return res
      .status(400)
      .json({ success: false, error: 'Your certi already exists' });
  }

  try {
    const result = await Certi.create({
      name,
      dob,
      startDate,
      endDate,
      work,
      certiId
    });

    console.log(result);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'certi added successfully',
    });

  } catch (error) {
    console.error('Certi Error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to add certi record' });
  }
});

app.post('/certi-details', async(req, res) => {
  try {
    const { certiid } = req.body;

    const certiDetails = await Certi.findOne({ certiId:certiid });

    if (!certiDetails) {
      return res.status(404).json({ success: false, message: 'Certificate details not found' });
    }

    res.status(200).json({ success: true, data: certiDetails });
  } catch (error) {
    console.error('Error processing certification ID:', error);
    res.status(500).json({ success: false, message: 'Failed to process certification ID' });
  }
});




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



  app.post("/passport", async (req, res) => {
    const { name,date,idType, work, } = req.body;
  
    const existingRecord = await User.findOne({ name, work});
  
    if (existingRecord) {
      return res
        .status(400)
        .json({ success: false, error: "Your record already exists" });
    }
  
    try {
      const result = await Passport.create({
        name,
        date,
        idType,
        work,
      });
  
      console.log(result);
  
      // Send success response
      res
        .status(200)
        .json({ success: true, message: "Thanks record added successfully" });
  
     
    } catch (error) {
      console.error("Attendance Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add attendance record" });
    }
  });

  app.post("/passport-delete", async (req, res) => {
    const { id } = req.body;
  
    try {
      const result = await Passport.findByIdAndDelete({_id:id});
  
      if (result) {
      return  res.json({ success: true, message: "Record deleted successfully" });
      } else {
        return res.json({ success: false, message: "Record not found" });
      }
    } catch (error) {
      console.error("Deletion error:", error);
      res.status(500).json({ success: false, message: "Failed to delete record" });
    }
  });
  
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


  app.get("/passport-info", async (req, res) => {
    try {
      const PassportData = await Passport.find();
      res.status(200).json(PassportData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // schedule.scheduleJob('0 0 * * 6,0', async () => {
  //   try {
  //     const users = await File.find();
  
  //     for (const user of users) {
      
  
       
  //         const transporter = nodemailer.createTransport({
  //           service: 'gmail',
  //           auth: {
  //             user: 'veer2238rajput@gmail.com',
  //             pass: 'ngpb hgqv hztj cuuc'
  //           },
  //         });
  
  //         const mailOptions = {
  //           from: 'veer2238rajput@gmail.com',
  //           to: user.email,
  //           subject: ' V-Ex Tech Solution (Weekend Holiday Notice)',
  //           html: `
  //             <div style="font-family: Arial, sans-serif; padding: 20px;">
  //               <img src="https://v-extechsolution.in/static/media/logo.b48612c02e688a28a62f.png" alt="V-Ex Tech Solution Logo" style="max-width: 200px; margin-bottom: 20px;" />
  //               <p style="font-size: 16px; line-height: 1.6;">
  //                 Dear ${user.name},
  //                 <br><br>
  //                 We hope this message finds you well. We would like to inform you that <strong style="color: #ff0000;">Saturday and Sunday (the weekend) are observed as holidays</strong> in our company.
  //                 <br><br>
  //                 During this time, our offices will be <strong>closed</strong>, and normal business operations will resume on Monday.
  //                 <br><br>
  //                 Thank you for your understanding, and we wish you a pleasant weekend!
  //                 <br><br>
  //                 Best regards,
  //                 <br>
  //                 V-Ex Tech Solution Team
  //               </p>
  //               <div style="margin-top: 50px; color: #666;">
  //               <a href="https://v-extechsolution.in" style="font-size: 16px; line-height: 1.5;">v-extechsolution.in</a><br>
  //               <a href="mailto:veeragraval@v-extechsolution.in" style="font-size: 16px; line-height: 1.5;">veeragraval@v-extechsolution.in</a><br>
  //               <a href="tel:9664768292" style="font-size: 16px; line-height: 1.5;">+91 9664768292</a>
  //         <div style="margin-top: 50px;">
  //               <a href="https://www.linkedin.com/company/v-ex-tech-software-company-in-vadodara/mycompany/" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/1MpdrG8/download-1.png" alt="download-1" border="0" style="width:15%"></a>
  //               <a href="https://www.youtube.com/@Veer_Agraval" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/b60S7TZ/download.png" alt="download-1" border="0" style="width:15%"></a>
  //               <a href="https://www.instagram.com/v_extech/?igshid=Zjc2ZTc4Nzk%3D" style="text-decoration: none; color: #333; padding:0 14px;"><img src="https://i.ibb.co/xYLHv49/download.jpg" alt="download-1" border="0" style="width:15%"></a>
  //             </div>
  //             </div>
  //             <p style="color: #666; font-size: 16px; line-height: 1.5; margin-top: 20px;">Dhun Complex-301, Above Riya Bridal, near Amritsari Kulcha, opp. pavan park society, Nizampura, Vadodara, Gujarat 390002</p>
  
  //             </div>
  //           `,
  //         };
          
          
        
  //         const info = await transporter.sendMail(mailOptions);
  //         console.log('Email sent:', info.response);
  //         console.log('holiday emails sent successfully');
        
  //     }
  
     
  //   } catch (error) {
  //     console.error("Error sending birthday emails:", error);
  //   }
  // });




// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
