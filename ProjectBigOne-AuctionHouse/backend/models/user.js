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
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;