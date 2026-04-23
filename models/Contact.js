import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please use a valid 10-digit phone number"],
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    timestamps: true
  }
);

const ContactUser = mongoose.model("Contact", contactSchema);

export default ContactUser;