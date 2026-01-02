import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    messageType: { type: String, enum: ["text", "image", "audio"], default: "text" },
    isEdited: { type: Boolean, default: false }, // Added this line
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;