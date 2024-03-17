import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import nodemailer from 'nodemailer';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';



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


 const fileSchema = new mongoose.Schema({
  file: {
    filename: String,
    path: String,
    size: Number,
  },
  file2: {
    filename: String,
    path: String,
    size: Number,
  },
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
  referedby:String,
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
const ContactUser = mongoose.model("Contact", contactSchema);
  
// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use(bodyParser.json());

app.post('/upload',upload.fields([{ name: 'file', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), async (req, res) => {
  const { file, file2 } = req.files;
  const { name,mobile,dob,email,permanentadd,presentadd,pincode,institutename,education,currentstatus,techopted,duration,fees,referedby } = req.body; 
  const fileData = {
    filename: file[0].filename,
    path: file[0].path,
    size: file[0].size,
  };

  const file2Data = {
    filename: file2[0].filename,
    path: file2[0].path,
    size: file2[0].size,
  };
  const newFile = new File({
  
    file: fileData,
    file2: file2Data,
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
    referedby
  });

  
  try {
    await newFile.save();
    console.log(newFile);


   

    res.send('File uploaded successfully');
 
  } catch (err) {
    console.error("Error saving file to database:", err);
    res.status(500).send("Error saving file to database");
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

app.post("/contact", async (req, res) => {
  const {name,email,phone,message} = req.body;
try{
  const exist =await ContactUser.findOne({email,message})
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
        <div style="background-color: #f8f8f8; padding: 20px; font-family: 'Arial', sans-serif; color: #333;">
          <p style="font-size: 18px; color: #007BFF;">Hi ${req.body.name},</p>
          <p style="font-size: 16px;">Thank you for contacting V-Ex Tech Solution. We have received your query and will get back to you soon.</p>
    
          <div style="margin: 20px 0; padding: 10px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 16px;">We have your contact details:</p>
            <p style="font-size: 16px; margin-bottom: 5px;"><strong>Email:</strong> ${req.body.email}</p>
            <p style="font-size: 16px; margin-bottom: 5px;"><strong>Phone:</strong> ${req.body.phone}</p>
          </div>
    
          <img src="https://v-extechsolution.in/static/media/logo.b48612c02e688a28a62f.png" alt="Thank You Image" style="max-width: 100%; height: auto; margin-bottom: 20px;">
    
          <p style="font-size: 16px;">In the meantime, feel free to call us at <strong style="color: #007BFF;">+91 9664768292</strong>. We look forward to assisting you!</p>
    
          <p style="font-size: 16px; margin-top: 20px;">Best regards,</p>
          <p style="font-size: 16px;">V-Ex Tech Solution</p>
          <p style="font-size: 16px;">301, DHUN COMPLEX, ABOVE</p>
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
    });
    

    console.log("Message sent:", info.messageId);
    res.json({success:true,message:'message sent'})

  } catch (error) {
    console.error("Contact Error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to send message" });
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



app.get("/enquiry", async (req, res) => {
  try {
    const allEnuiryData = await ContactUser.find();
    res.status(200).json(allEnuiryData);
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









// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
