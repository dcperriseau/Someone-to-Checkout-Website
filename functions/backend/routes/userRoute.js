import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Create user route
router.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json({ message: 'User created successfully' });
});

// Delete user route
router.delete('/delete/:uid', userController.deleteUser, (req, res) => {
  res.status(200).json({ message: 'User deleted successfully' });
});

// Login route
router.post('/login', userController.loginUser);

// Get user profile route
router.get('/profile', authController.verifyToken, userController.getUserProfile);

export default router;
