import mongoose from "mongoose";

const passportfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  appointmentdate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },

  username:{
  type:String,
    default:'not entered'
  },

  password:{
  type:String,
    default:'not entered'
  },

  Fileno: {
    type:String,
    default:'not generated'
  },

  Filestatus: {
    type:String,
    default:'not updated'
  }



});

const Passportfile = mongoose.model('passportfile', passportfileSchema);

export default Passportfile