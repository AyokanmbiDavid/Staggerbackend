import express from 'express';
import { createConversation, getConversation, postMessage, getUserConversations, deleteMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', createConversation);
router.get('/user/:userId', getUserConversations);
router.get('/:id', getConversation);
router.post('/:id/messages', postMessage);
router.delete('/:convoId/messages/:messageId', deleteMessage);

export default router;
