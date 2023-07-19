const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    chatId: {type: Number, required: true, unique: true},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    role: {type: String, default: 'intern'},
});

const Index = mongoose.model('User', userSchema);

module.exports = {User: Index}