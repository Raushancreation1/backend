const mongoose = require('mongoose');

// Define the Profile schema
const ProfileSchema = new mongoose.Schema({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
}, { timestamps: true });

// Export the Profile model
module.exports = mongoose.model("Profile", ProfileSchema);
