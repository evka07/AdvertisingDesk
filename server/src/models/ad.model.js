const mongoose = require('mongoose')
const adSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  imageUrl: {type: String, required: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  createdAt: {type: Date, default: Date.now},

})

const Ad = mongoose.model('Ad', adSchema)
module.exports = Ad