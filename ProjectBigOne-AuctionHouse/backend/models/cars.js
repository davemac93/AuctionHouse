const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: String,
    make: String,
    year: Number,
    mileage: Number,
    auctionEnd: Date,
    startingPrice: Number,
    currentAuctionPrice: { type: Number }, // Removed the default value
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    imagePaths: [{ type: String }],
    videoPath: String, // New field for video
    tags: [{ type: String }], // New field for array of strings (tags)
    detailsPage: String,
    onAuctionPage: Boolean,
});

// Initialize currentAuctionPrice with startingPrice
carSchema.pre('save', function(next) {
    if (!this.currentAuctionPrice) {
        this.currentAuctionPrice = this.startingPrice;
    }
    next();
});

// Method to place a bid on the car auction
carSchema.methods.placeBid = function(newPrice, userID) {
    if (newPrice > this.currentAuctionPrice) {
        this.currentAuctionPrice = newPrice;
        this.userID = userID;
        return true; // Bid successfully placed
    } else {
        return false; // Bid price is not higher than current auction price
    }
};

// Method to check if the auction is still ongoing
carSchema.methods.isAuctionOngoing = function() {
    return Date.now() < this.auctionEnd;
};

const Car = mongoose.model('Car', carSchema);

module.exports = Car;