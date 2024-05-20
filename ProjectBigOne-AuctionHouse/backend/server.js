const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const nodemailer = require('nodemailer');
const http = require('http');
const socketIo = require('socket.io');
const sendEmail = require('../backend/js/sell.js'); // Importing sendEmail function
const Car = require('./models/cars');
const User = require('./models/user');
const Blog = require('./models/blogs');


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://auctionhouse-olvi.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
const saltRounds = 10;
const dbURL = 'mongodb+srv://dawidmac:BxsbFg0hl0WO3a5O@auctionhouse-dev-v1.1ggmddb.mongodb.net/';

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// Middleware & static files
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Configure session
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../frontend/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect(dbURL)
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware to check login status
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const checkLoggedIn = (req, res, next) => {
  res.locals.loggedIn = !!req.session.userId;
  next();
};

app.use(checkLoggedIn);

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle bid updates
  socket.on('newBid', (data) => {
    console.log('New bid received:', data);
    io.emit('newBid', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


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
      return res.redirect('/403');
    }
    res.render('detailsBlog', { blog }); // Render the EJS file with the blog data
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/detailsCar/:id', checkLoggedIn, async (req, res) => {
  try {
    // Fetch car details from the database based on the provided ID
    const car = await Car.findById(req.params.id).exec();
    if (!car) {
      return res.redirect('/404');
    }

    // Assuming you have a logic to check if the user is registered to bid

    res.render('detailsCar', { car, loggedIn: res.locals.loggedIn, userId: req.session.userId }); // Pass the car data and userRegisteredToBid to the template
  } catch (error) {
    console.error('Error fetching car details:', error);
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

app.get('/confirmationEmail', (req, res) => {
  res.render('confirmationEmail')
});

app.get('/auction', checkLoggedIn, async (req, res) => {
  try {
    // Fetch cars for auction where onAuctionPage is true
    const carsForAuction = await Car.find({ onAuctionPage: true });

    // Check if there are any cars available for auction
    if (carsForAuction.length === 0) {
      return res.render('auctionNoCar'); // Render the "auctionNoCar" view
    }

    // Assuming you want to display the details of the first car in the auction
    const car = carsForAuction[0];

    // Problem z tym

    // Check if the auction is still ongoing
    if (!car.isAuctionOngoing()) {
      return res.render('auctionNoCar'); // Render the "auctionNoCar" view
    }

    // Fetch users who placed bids on the current car excluding the admin user
    const users = await User.find({ _id: { $ne: '6644c13665bbcbdd9c7c3134', $in: car.userID } });

    res.render('auction', { userId: req.session.userId, car, users, loggedIn: res.locals.loggedIn });
  } catch (error) {
    console.error('Error fetching cars for auction:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/place-bid', async (req, res) => {
  const { bidAmount, carId } = req.body;
  const userId = req.session.userId;

  try {
    // Find the car by ID
    const car = await Car.findById(carId);

    // Check if the auction is still ongoing
    if (!car.isAuctionOngoing()) {
      return res.status(400).send('Auction has ended'); // Return a 400 status if auction has ended
    }

    // Check if the bid amount is higher than the current auction price
    if (bidAmount <= car.currentAuctionPrice) {
      return res.status(400).send('Bid amount must be higher than current price'); // Return a 400 status if bid amount is not higher
    }

    // Place the bid
    const bidPlaced = car.placeBid(bidAmount, userId);

    if (bidPlaced) {
      // Save the updated car document
      await car.save();
      
      // Emit the new bid information to all connected clients
      io.emit('newBid', {
        carId,
        bidAmount: car.currentAuctionPrice,
        user: await User.findById(userId)
      });

      res.redirect('/auction'); // Redirect to the auction page
    } else {
      res.status(400).send('Bid amount must be higher than current price'); // Return a 400 status if bid amount is not higher
    }
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/add-car', checkLoggedIn, (req, res) => {
  res.render('addCar', { loggedIn: res.locals.loggedIn, userId: req.session.userId });
});

app.post('/cars', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { userId } = req.session; // Get the userId from the session

    // Check if the user is authorized to add cars (assuming the admin user has a specific _id)
    if (userId !== '6644c13665bbcbdd9c7c3134') {
      return res.redirect('/403');
    }

    const carData = req.body;
    const images = req.files['images'].map(file => {
      // Extract the filename from the path
      const filename = path.basename(file.path);
      // Prepend /uploads prefix to the filename
      return `/uploads/${filename}`;
    });

    const video = req.files['video'][0]; // Get the video file
    const videoPath = video ? `/uploads/${path.basename(video.path)}` : null;

    const tag1 = req.body.tag1;
    const tag2 = req.body.tag2;
    const tag3 = req.body.tag3;

    // Store tags in an array
    const tags = [tag1, tag2, tag3].filter(tag => tag);

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
      videoPath: videoPath,
      tags: tags,
      detailsPage: carData.detailsPage,
      onAuctionPage: false,
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

app.get('/404', checkLoggedIn, (req, res) => {
  res.render('404');
});

app.get('/403', checkLoggedIn, (req, res) => {
  res.render('403');
});

app.post('/blogs', upload.fields([{ name: 'images', maxCount: 5 }]), async (req, res) => {
  try {
    const { userId } = req.session; // Get the userId from the session

    // Check if the user is authorized to add cars (assuming the admin user has a specific _id)
    if (userId !== '6644c13665bbcbdd9c7c3134') {
      return res.redirect('/403');
    }

    const blogData = req.body;
    const images = req.files['images'].map(file => {
      // Extract the filename from the path
      const filename = path.basename(file.path);
      // Prepend /uploads prefix to the filename
      return `/uploads/${filename}`;
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

app.get('/add-car-auction', checkLoggedIn, async (req, res) => {

  try {
    // Fetch all cars from the database
    const cars = await Car.find();
    
    res.render('addCarAuction', { cars, path, loggedIn: res.locals.loggedIn, userId: req.session.userId }); // Pass the fetched cars and the path module to the collection view
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/updateAuctionPage', async (req, res) => {
  const { carId } = req.body;

  try {
    // Find the car by ID
    const car = await Car.findById(carId);

    const { userId } = req.session; // Get the userId from the session

    // Check if the user is authorized to add cars (assuming the admin user has a specific _id)
    if (userId !== '6644c13665bbcbdd9c7c3134') {
      return res.redirect('/403'); // Return Forbidden status if not authorized
    }

    if (!car) {
      return res.redirect('/403');
    }

    // Toggle the onAuctionPage field
    car.onAuctionPage = !car.onAuctionPage;

    // Save the updated car document
    await car.save();

    res.redirect('/add-car-auction');
  } catch (error) {
    console.error('Error updating car:', error);
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
    const user = await User.findById(userId).populate('ownedCars'); // Populate the ownedCars field to get make and model

    // Fetch cars won by the user
    const userCars = await Car.find({ userID: userId, auctionEnd: { $lt: new Date() } });

    // Render the profile EJS file and pass both user data, userCars, and ownedCars to it
    res.render('profile', { user, userCars });
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

app.post('/submit-form', async (req, res) => {
  const { nameSell, namelastSell, email, phoneNumber, sellDescription, carDetails } = req.body;

  try {
    // Send email
    await sendEmail(nameSell, namelastSell, email, phoneNumber, sellDescription, carDetails);

    // Redirect after email is sent
    console.error(nameSell, namelastSell, email, phoneNumber, sellDescription, carDetails);
    res.redirect('/confirmationEmail');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-owned-cars', async (req, res) => {
  const { make, model } = req.body; // Extract make and model from the request body

  try {
    // Create a new owned car object with make and model
    const newOwnedCar = {
      make,
      model,
    };

    // Update the corresponding User document to include the new owned car
    await User.findByIdAndUpdate(req.session.userId, { $push: { ownedCars: newOwnedCar } });

    // Redirect to a confirmation page or any other desired page
    res.redirect('/profile');
  } catch (error) {
    console.error('Error adding owned car:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/remove-owned-car', async (req, res) => {
  const { carId } = req.body;

  try {
    // Remove the car from the user's ownedCars array
    await User.findByIdAndUpdate(req.session.userId, { $pull: { ownedCars: { _id: carId } } });

    // Redirect to profile page or any other desired page
    res.redirect('/profile');
  } catch (error) {
    console.error('Error removing owned car:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/update-profile', requireLogin, async (req, res) => {
  try {
    // Retrieve user data from the database based on the logged-in user's ID
    const userId = req.session.userId;
    const user = await User.findById(userId);

    // Render the profile EJS file and pass both user data, userCars, and ownedCars to it
    res.render('updateProfileData', { user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

app.post('/update-profile-next', async (req, res) => {
  const { name, lastname, email } = req.body; // Extract form data from the request body

  try {
    // Assuming you have a User model, update the user data in the database
    const userId = req.session.userId; // Get the logged-in user's ID from the session
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect('/403');
    }

    // Update user data
    user.name = name;
    user.lastname = lastname;
    user.email = email;

    // Save the updated user data
    await user.save();

    res.redirect('/profile'); // Redirect to the profile page after updating the profile
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use((req, res) => {
  res.redirect('/404');
});

