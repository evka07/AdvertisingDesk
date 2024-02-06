const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Session = require('../models/session.model');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/authMiddleWare');

router.post('/register', async (req, res) => {
  try {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username});
    if (existingUser) {
      return res.status(400).json({error: 'User with such username is already exist'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({message: 'Registration is successful'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if (!user) {
      return res.status(401).json({error: 'Username is incorrect'});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({error: 'wrong password'});
    }

    req.session.user = {
      id: user._id,
      username: user.username
    };
    res.json({message: 'Loged in successful'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.delete('/logout', authMiddleware, async (req, res) => {
  try {
    await Session.deleteMany({user: req.session.user.id});
    req.session.destroy();
    res.json({message: 'Logout successful'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;


