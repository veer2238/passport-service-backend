import TaskRegister from "../models/TaskRegister.js";

import express from "express";
const app = express();





// Task register route
app.post("/task-register", async (req, res) => {
  const { name,work, assigndate, completiondate, description } = req.body;
  try {
    const result = await TaskRegister.create({
      name,work, assigndate, completiondate, description
    });

    console.log(result);
    res.json({ success: true, message: 'Task assigned successfully' });
  } catch (error) {
    console.error("Task Register Error:", error);
    res.status(500).json({ success: false, error: "Failed to assign task" });
  }
});

app.get("/task-info", async (req, res) => {
    try {
      const TaskData = await TaskRegister.find();
      res.status(200).json(TaskData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  app.post("/task-delete", async (req, res) => {
    const { id } = req.body;
  
    try {
      const result = await TaskRegister.findByIdAndDelete({_id:id});
  
      if (result) {
      return  res.json({ success: true, message: "Task deleted successfully" });
      } else {
        return res.json({ success: false, message: "Task not found" });
      }
    } catch (error) {
      console.error("Deletion error:", error);
      res.status(500).json({ success: false, message: "Failed to delete record" });
    }
  });



// Export the app
export default app;
