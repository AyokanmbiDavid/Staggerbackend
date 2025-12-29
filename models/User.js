import mongoose from 'mongoose';
const { Schema } = mongoose;

// User schema includes basic profile fields and references to conversations
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  // references to Conversation documents
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
