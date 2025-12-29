import express from 'express';
import { createUser,getAUser,getAllUsers,updateUser,deleteUser, loginUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:email', getAUser);
userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.put('/:email', updateUser);
userRouter.delete('/:email', deleteUser);

export default userRouter;