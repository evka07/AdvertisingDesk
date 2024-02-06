const express = require('express')
const router = express.Router()
const Ad = require('../models/ad.model')
const authMiddleware = require('../middleware/authMiddleWare')

router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find()
    res.json(ads)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad){
      return res.status(404).json({error: 'The advert isn`t found '})

    }
    res.json(ad)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newAd = new Ad(req.body)
    await newAd.save()
    res.status(201).json({message: 'Advert is added'})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
    if (!ad) {
      return res.status(404).json({error: 'The advert doesn`t exist'})
    }
    await ad.remove()
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

router.put('/:id', authMiddleware, async (req, res) => {
  try{
    const {id} = req.params
    const updatedAd = await Ad.findByIdAndUpdate(id, req.body, {new: true})
    if (!updatedAd) {
      return res.status(404).json({error: 'The advert doesn`t exist'})
    }
    res.json({message: 'The advert is updated', updatedAd})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

module.exports = router