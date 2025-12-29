import User from '../models/User.js';
import Conversation from '../models/Conversation.js';

// Create a conversation with participant ids (array)
export async function createConversation(req, res) {
	try {
		const { participants = [], initialMessage } = req.body || {};
		if (!Array.isArray(participants) || participants.length < 2) {
			return res.status(400).json({ error: 'participants (array) with at least 2 ids required' });
		}

		const convo = new Conversation({ participants: participants.map(id => id.toString()) });
		if (initialMessage) convo.messages.push(initialMessage);
		await convo.save();

		// add conversation reference to each participant user
		await User.updateMany({ _id: { $in: participants } }, { $addToSet: { conversations: convo._id } });

		res.status(201).json(convo);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

// Get conversation by id
export async function getConversation(req, res) {
	try {
		const id = req.params.id;
		const convo = await Conversation.findById(id).populate('participants', 'username email avatar').populate('messages.sender', 'username');
		if (!convo) return res.status(404).json({ error: 'Conversation not found' });
		res.status(200).json(convo);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

// Post a message to a conversation
export async function postMessage(req, res) {
	try {
		const id = req.params.id;
		const { sender, senderName, text } = req.body || {};
		if (!sender || !text) return res.status(400).json({ error: 'sender and text are required' });
		const convo = await Conversation.findById(id);
		if (!convo) return res.status(404).json({ error: 'Conversation not found' });

		const msg = { sender, senderName: senderName || '', text };
		convo.messages.push(msg);
		convo.lastUpdated = new Date();
		await convo.save();

		res.status(201).json(convo.messages[convo.messages.length - 1]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

// Get conversations for a given user id
export async function getUserConversations(req, res) {
	try {
		const userId = req.params.userId;
		const convos = await Conversation.find({ participants: userId }).sort({ lastUpdated: -1 }).populate('participants', 'username email avatar');
		res.status(200).json(convos);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}

// Optional: delete a message by message id within a conversation
export async function deleteMessage(req, res) {
	try {
		const { convoId, messageId } = req.params;
		const convo = await Conversation.findById(convoId);
		if (!convo) return res.status(404).json({ error: 'Conversation not found' });
		const msg = convo.messages.id(messageId);
		if (!msg) return res.status(404).json({ error: 'Message not found' });
		msg.remove();
		await convo.save();
		res.status(200).json({ message: 'Deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
