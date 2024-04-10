const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const User = require('./models/user')
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// register view engie
app.set('view engine', 'ejs')

//middleware & static files
app.use(morgan('dev'));
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded( {extended: true }));
app.use(express.json());


const dbURL = 'mongodb+srv://dawidmac:BxsbFg0hl0WO3a5O@auctionhouse-dev-v1.1ggmddb.mongodb.net/'

//Connection To MongoDV
mongoose.connect(dbURL)
  .then((result) => {
    app.listen(3000, () => {
      console.log('Server is running')
    })
  })
  .catch((err) => {
    console.log('MongoDB connection error:' + err);
  });

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.render('index')
});

app.get('/about', (req, res) => {
  res.render('about')
});

app.get('/collection', (req, res) => {
  res.render('collection')
});

app.get('/detailsBlog', (req, res) => {
  res.render('detailsBlog')
});

app.get('/sell', (req, res) => {
  res.render('sell')
});

app.get('/reg-log', (req, res) => {
  res.render('reg-log')
});

app.get('/confirmationRegister', (req, res) => {
  res.render('confirmationRegister')
});

app.post('/users', async (req, res) => {
  const { name, lastname, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!name || !lastname || !email || !password) {
      return res.status(400).send('All fields are required');
    }
    
    console.log(req.body);

    const user = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    console.log(user);

    await user.save();
    
    res.redirect('/confirmationRegister');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving user');
  }
});

app.post('/login', async (req, res) => {

  const { email, password } = req.body;
  console.log(req.body)
  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Invalid email')
      return res.status(401).send('Invalid data');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password')
      return res.status(401).send('Invalid data');
    }

    res.redirect('/');
    console.log(user.email);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

