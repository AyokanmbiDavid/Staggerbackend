import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { text, mediaUrl, messageType, receiverId } = req.body;
    const senderId = req.user._id; // Get from protected route middleware

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      mediaUrl,
      messageType,
    });

    await newMessage.save();

    // Note: Real-time emission happens in the Socket.io logic
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Find all messages where (I am sender AND they are receiver) OR (They are sender AND I am receiver)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sort by time (oldest to newest)

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add these to controllers/message.controller.js

export const editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only allow editing if they are the sender and it's a text message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    message.text = text;
    // We mark it as edited so the UI can show "(edited)"
    message.isEdited = true; 

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error editing message" });
  }
};

export const clearChat = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // The ID of the person you are chatting with
    const myId = req.user._id;

    // This deletes the entire history between these two users
    await Message.deleteMany({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing chat" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) return res.status(404).json({ message: "Message not found" });

    // Only the sender can delete their own message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete this message" });
    }

    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};