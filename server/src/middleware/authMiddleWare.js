const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')

    if (!token) {
      throw new Error('Authorization failed')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if (!user) {
      throw new Error('User not found')
    }

    req.user = user
    req.token = token

    next()
  } catch (error) {
    res.status(401).send({error: 'Authorization failed'})
  }
}

module.exports = authMiddleware