import mongoose from "mongoose";

const completionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enrollment: {
    type: String,
    required: true,
  },
  collegename: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  startdate: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
    required: true,
  },
  completiondate: {
    type: String,
    required: true,
  },
  certiId: {
    type: String,
    required: true,
    unique: true,
  },

  work: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Completion = mongoose.model("Completion", completionSchema);

export default Completion;