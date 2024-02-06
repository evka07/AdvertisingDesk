const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/adRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./models/user.model');
const Ad = require('./models/ad.model');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect('mongodb+srv://threeways007:AdvertisingDesk@cluster1.fzf2cia.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || '5bb62140aff0c3595d7c4d887c636137868881bb0219dfc1bb170a0d5424848a08d44cb1ea45e5773f3c5aba0003a2ca19fd02ec412c7ca8b19930414d49e8e1',
    resave: false,
    saveUninitialized: true,
  })
);


app.use('/api/auth', authRoutes);

app.use('/api/ads', adRoutes);

app.get('/', (req, res) => {
  const endpoints = [
    { method: 'POST', path: '/api/auth/register', description: 'User registration' },
    { method: 'POST', path: '/api/auth/login', description: 'User authentication' },
    { method: 'GET', path: '/api/auth/logout', description: 'Log out' },
    { method: 'GET', path: '/api/auth/user', description: 'Getting user information' },
    { method: 'GET', path: '/api/ads', description: 'Receive all advertisements' },
    { method: 'GET', path: '/api/ads/:id', description: 'Receive a specific ad' },
    { method: 'POST', path: '/api/ads', description: 'Adding a new ad' },
    { method: 'PUT', path: '/api/ads/:id', description: 'Editing an ad' },
    { method: 'DELETE', path: '/api/ads/:id', description: 'Delete ad' },
    { method: 'GET', path: '/api/ads/search/:searchPhrase', description: 'Search ads by phrase' }
  ];
  res.json({ endpoints });
});


app.listen(PORT, () => {
  console.log('Server is running ' + PORT);
});
