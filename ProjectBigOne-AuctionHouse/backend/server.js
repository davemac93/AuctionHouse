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

const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
      return res.redirect('/login'); // Redirect to login page if not logged in
  }
  next();
};

const checkLoggedIn = (req, res, next) => {
  // Check if the user is logged in based on your session setup
  const loggedIn = req.session.userId ? true : false;
  // Pass the loggedIn variable to the response locals
  res.locals.loggedIn = loggedIn;
  next(); // Move to the next middleware or route handler
};

app.use(checkLoggedIn);


app.get('/', (req, res) => {
    res.render('index');
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
  
    req.session.userId = user.id; // Store user ID in session
    res.redirect('/');
    console.log(user.email);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', requireLogin, async (req, res) => {
  try {
    // Retrieve user data from the database based on the logged-in user's ID
    const userId = req.session.userId;
    const user = await User.findById(userId); // Assuming you have a User model

    // Render the profile EJS file and pass the user data to it
    res.render('profile', { user });
} catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
}
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/'); 
});

app.get('/check-login', (req, res) => {
  const loggedIn = !!req.session.userId;
  res.json({ loggedIn });
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

