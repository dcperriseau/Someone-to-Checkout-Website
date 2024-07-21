// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.createUser, (req, res) => {
  res.status(200).json( {message: 'User created successfully'} );
})

router.delete('/delete/:uid', userController.deleteUser, (req, res) => {
  res.status(200).json( {message: 'User deleted successfully'} );
})
// router.get('/login', createUser(req, res) => {
//   res.send('Login route');
// });

module.exports = router;