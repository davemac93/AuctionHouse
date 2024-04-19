const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');

//models
const Car = require('./models/cars'); 
const User = require('./models/user');
const Blog = require('./models/blogs');


const saltRounds = 10;

// register view engie
app.set('view engine', 'ejs')

//middleware & static files
app.use(morgan('dev'));
app.set('views', path.join(__dirname, '../frontend/views'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded( {extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../frontend/uploads')); // Save uploaded files to the 'frontend/uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set a unique filename for each uploaded file
  }
});
const upload = multer({ storage: storage });


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


app.get('/', async (req, res) => {
    try {
      // Fetch all blogs from the database
      const blogs = await Blog.find();
      res.render('index', { blogs, path }); // Pass the fetched blogs and the path module to the collection view
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/about', (req, res) => {
  res.render('about')
});

app.get('/collection', async (req, res) => {
  try {
    // Fetch all cars from the database
    const cars = await Car.find();
    res.render('collection', { cars, path }); // Pass the fetched cars and the path module to the collection view
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/detailsBlog/:id', async (req, res) => {
  
  try {
      // Fetch blog details from the database based on the provided ID
      const blog = await Blog.findById(req.params.id).exec();
      if (!blog) {
          return res.status(404).send('Blog not found'); // Return a 404 if the blog with the provided ID is not found
      }
      res.render('detailsBlog', { blog }); // Render the EJS file with the blog data
  } catch (error) {
      console.error('Error fetching blog details:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/detailsCar/:id', async (req, res) => {
  
  try {
      // Fetch blog details from the database based on the provided ID
      const car = await Car.findById(req.params.id).exec();
      if (!car) {
          return res.status(404).send('Blog not found'); // Return a 404 if the blog with the provided ID is not found
      }
      res.render('detailsCar', { car }); // Render the EJS file with the blog data
  } catch (error) {
      console.error('Error fetching blog details:', error);
      res.status(500).send('Internal Server Error');
  }
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

app.get('/add-car', checkLoggedIn, (req, res) => {
  res.render('addCar', { loggedIn: res.locals.loggedIn, userId: req.session.userId });
});

app.post('/cars', upload.array('images', 5), async (req, res) => {
  try {
    const { userId } = req.session; // Get the userId from the session

    // Check if the user is authorized to add cars (assuming the admin user has a specific _id)
    if (userId !== '661851d28546736546d73758') {
      return res.status(403).send('Forbidden'); // Return Forbidden status if not authorized
    }

    const carData = req.body;
    const images = req.files.map(file => {
      // Construct the new path for the image
      const imagePath = file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      const relativePath = imagePath.replace(path.join(__dirname, '../frontend') + '/', ''); // Get relative path from frontend/uploads
      return relativePath;
    });

    // Create new car document
    const newCar = new Car({
      make: carData.make,
      model: carData.model,
      year: carData.year,
      mileage: carData.mileage,
      auctionEnd: carData.auctionEnd,
      startingPrice: carData.startingPrice,
      currentAuctionPrice: carData.startingPrice, // Set initial auction price to starting price
      userID: req.session.userId, // Associate the car with the logged-in user
      imagePaths: images, // Save file paths of uploaded images with modified paths
      detailsPage: carData.detailsPage,
    });

    // Save the new car to the database
    await newCar.save();

    res.status(201).send('Car added successfully');
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/add-blog', checkLoggedIn, (req, res) => {
  res.render('addBlog', { loggedIn: res.locals.loggedIn, userId: req.session.userId });
});

app.post('/blogs', upload.array('images', 5), async (req, res) => {
  try {
    const { userId } = req.session; // Get the userId from the session

    // Check if the user is authorized to add cars (assuming the admin user has a specific _id)
    if (userId !== '661851d28546736546d73758') {
      return res.status(403).send('Forbidden'); // Return Forbidden status if not authorized
    }

    const blogData = req.body;
    const images = req.files.map(file => {
      // Construct the new path for the image
      const imagePath = file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
      const relativePath = imagePath.replace(path.join(__dirname, '../frontend') + '/', ''); // Get relative path from frontend/uploads
      return relativePath;
    });

    // Create new car document
    const newBlog = new Blog({
      title: blogData.title,
      dateOfAdding: blogData.dateOfAdding,
      imagePaths: images, // Save file paths of uploaded images with modified paths
      text1: blogData.text1,
      text2: blogData.text2,
      text3: blogData.text3,
      text4: blogData.text4,
    });

    // Save the new car to the database
    await newBlog.save();

    res.status(201).send('Blog added successfully');
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).send('Internal Server Error');
  }
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

