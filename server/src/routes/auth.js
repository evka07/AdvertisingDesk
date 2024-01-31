const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleWare');
const Session = require('../models/session.model');
const getImageFileType = require('../utils/getImageFileType');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cd) => {
  if (file.fieldname === 'image') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, true);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5
}

const upload = multer({storage, fileFilter, limits})
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

router.post('/createAd', authMiddleware, upload.single('image', async (req, res) => {
  try {
    const fileType = await getImageFileType(req.file)
    if (fileType === 'unknown'){
      fs.unlinkSync(req.file.path)
      return res.status(400).send({error: 'Invalid image'})
    }
    res.send({message: 'Ad image'})
  } catch (error) {
    console.error(error)
    res.status(500).send({error: 'Server Error'})
  }
}))

router.delete('/logout', authMiddleware, async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    await Session.deleteMany({});
  } else {
    req.session.destroy();
  }

  res.send({message: 'Logged out successfully'});
});
module.exports = router;