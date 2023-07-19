const mongoose = require('mongoose')


const markSchema = new mongoose.Schema({
    userMarkId: {type: Number, required: true},
    adminMarkId: {type: Number, required: true},
    markType: {type: String, required: true},
    mark: {type: Number, required: true, default: 0},
    datetime: {type: Date, default: Date.now},
});

const Index = mongoose.model('Mark', markSchema);

module.exports = {Mark: Index}