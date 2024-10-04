import mongoose from "mongoose";

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

  const User = mongoose.model("Attend", attendaceSchema);

  export default User