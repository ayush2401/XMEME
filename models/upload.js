const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    author: String,
    caption: String,
    url: String
} , {timestamps: true});

const uploadModel = mongoose.model('xmeme' , Schema);
module.exports = uploadModel;