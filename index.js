import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Contactroute from './routes/Contact.js';
import Payroute from './routes/Payment.js'
import Fileroute from './routes/File.js'
import Birthroute from './routes/Birthday.js'
import Task from './routes/TaskRegister.js'
import Subscribe from './routes/Subscribe.js'
import completionRoutes from "./routes/Completion.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(express.json());

app.use(cors());

app.use('/',Contactroute)
app.use('/',Payroute)
app.use('/',Task)
app.use('/',Fileroute)
app.use('/',Birthroute)
app.use('/',Subscribe)
app.use("/", completionRoutes);






  // DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));











app.listen(9000, () => {
  console.log('Server is connected');
});
