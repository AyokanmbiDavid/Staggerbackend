import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// create User
export async function createUser(req, res) {
  try {
    const { username, email, password, avatar, bio } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }
    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email: normalizedEmail, password: hashed, avatar, bio });
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// get all Users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// get A user by email
export async function getAUser(req, res) {
  try {
    const email = String(req.params.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'Email parameter is required' });
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// update a user by email
export async function updateUser(req, res) {
  try {
    const email = String(req.params.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'Email parameter is required' });

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updated = await User.findOneAndUpdate({ email }, updates, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// delete a User by email
export async function deleteUser(req, res) {
  try {
    const email = String(req.params.email || req.body.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'Email parameter is required' });
    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login user - returns JWT
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { id: user._id.toString(), username: user.username, email: user.email };
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

