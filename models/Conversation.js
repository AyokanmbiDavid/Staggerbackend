import mongoose from 'mongoose';
const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  text: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  edited: { type: Boolean, default: false },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { _id: true });

const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [MessageSchema],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Conversation', ConversationSchema);
