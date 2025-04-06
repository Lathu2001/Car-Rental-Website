const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    city: { type: String },
    address: { type: String },
    NICNumber: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema);
