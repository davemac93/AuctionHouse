const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    password: String,
    ownedCars: [{
        make: String,
        model: String,
        // Add any additional fields you need for owned cars
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;