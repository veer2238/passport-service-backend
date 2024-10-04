
import User from '../models/Attendance.js'
import express from "express";

const app = express();


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


  export default app