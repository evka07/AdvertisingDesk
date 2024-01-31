const authMiddleWare = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(401).send({message: 'you are not auth'})
  }
}

module.exports = authMiddleWare