const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session');
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middleware/authMiddleware')


const app = express()
const PORT = process.env.PORT || 8000

mongoose.connect('mongodb+srv://threeways007:AdvertisingDesk@cluster1.fzf2cia.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET || '5bb62140aff0c3595d7c4d887c636137868881bb0219dfc1bb170a0d5424848a08d44cb1ea45e5773f3c5aba0003a2ca19fd02ec412c7ca8b19930414d49e8e1',
    resave: false,
    saveUninitialized: true,
  })
)

app.use('/api/auth', authRoutes)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.send({message: 'Protected endpoint'})
})

app.listen(PORT, () => {
  console.log('Server is running ' + PORT);
})


