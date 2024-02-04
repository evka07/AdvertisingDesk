const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleWare');
const adRoutes = require('./adRoutes');

router.post('/login', async (req, res) => {
  req.session.user = {
    id: 'user_id',
    login: 'user_login',
  };
  const sessionData = {
    user: req.session.user
  };

  const sessionRecord = new Session({
    expires: new Date(),
    session: JSON.stringify(sessionData)
  });
  await sessionRecord.save();
  res.send({message: 'Login successful'});
});

router.use('/ads', adRoutes);

router.delete('/logout', authMiddleware, async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    await Session.deleteMany({});
  } else {
    req.session.destroy();
  }

  res.send({message: 'Logged out successfully'});
});


router.get('/user', authMiddleware, (req, res) => {

  res.send({message: 'Get user info'});
});

router.post('/register', async (req, res) => {

  res.send({message: 'Register new user'});
});

module.exports = router;
