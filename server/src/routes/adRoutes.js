const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleWare');
const getImageFileType = require('../utils/getImageFileType');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
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

router.get('/', authMiddleware, async (req, res) => {
  // Логика получения всех объявлений
  res.send({message: 'Get all ads'});
});


router.get('/:id', authMiddleware, async (req, res) => {
  // Логика получения конкретного объявления
  res.send({message: 'Get ad by ID'});
});


router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const fileType = await getImageFileType(req.file)
    if (fileType === 'unknown'){
      fs.unlinkSync(req.file.path)
      return res.status(400).send({error: 'Invalid image'})
    }

    res.send({message: 'Add new ad'});
  } catch (error) {
    console.error(error)
    res.status(500).send({error: 'Server Error'})
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {

  res.send({message: 'Delete ad'});
});

router.put('/:id', authMiddleware, async (req, res) => {
  res.send({message: 'Edit ad'});
});

router.get('/search/:searchPhrase', authMiddleware, async (req, res) => {
  res.send({message: 'Search ads by phrase'});
});

module.exports = router;
