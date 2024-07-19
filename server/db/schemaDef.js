// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the schemas used in the code


// Define User schema
const mongoose = require("mongoose");


// Define User schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {type: String, enum: ['admin', 'user'], default: 'user'}
});


// Define Car schema
const carSchema = new mongoose.Schema({
    make: String,
    model: String,
    year: {
        type: Number,
        min: [2000, 'Must be at least 2000, got {VALUE}'],
    },
    price: {
        type: Number,
        min: [0, 'Must be > 0, got {VALUE}'],
    },
    color: String,
    vin: String,
    image: String,
    fuelType: String,
    transmission: String,
    mileage: {
        type: Number,
        min: [0, 'Must be > 0, got {VALUE}'],
    },
    engineType: String,
    status: {
        type: String,
        enum: ['pending', 'sold', 'available'],
        default: 'available'
    },
    imgPath: String
});

// Create User model
const User = mongoose.model('User', userSchema);

// Create Car model
const Car = mongoose.model('Car', carSchema);


module.exports = {userSchema, carSchema, User, Car};