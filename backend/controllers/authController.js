// middleware/authMiddleware.js
const { auth } = require('../adminConfig');

const authController = {};

authController.verifyToken = async (req, res, next) => {
  console.log('in verify token middleware');
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

module.exports = authController;
