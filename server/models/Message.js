import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isBot: { type: Boolean, default: false },
    language: { type: String, enum: ["en", "ar"], required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;


