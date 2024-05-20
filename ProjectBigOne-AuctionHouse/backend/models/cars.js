const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    model: String,
    make: String,
    year: Number,
    mileage: Number,
    auctionEnd: Date,
    startingPrice: Number,
    currentAuctionPrice: { type: Number }, 
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    imagePaths: [{ type: String }],
    videoPath: String,
    tags: [{ type: String }],
    detailsPage: String,
    onAuctionPage: Boolean,
});


carSchema.pre('save', function(next) {
    if (!this.currentAuctionPrice) {
        this.currentAuctionPrice = this.startingPrice;
    }
    next();
});


carSchema.methods.placeBid = function(newPrice, userID) {
    if (newPrice > this.currentAuctionPrice) {
        this.currentAuctionPrice = newPrice;
        this.userID = userID;
        return true; 
    } else {
        return false; 
    }
};

carSchema.methods.isAuctionOngoing = function() {
    return Date.now() < this.auctionEnd;
};

const Car = mongoose.model('Car', carSchema);

module.exports = Car;