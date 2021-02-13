const mongoose = require('mongoose')
// Data base model with a mongoose schema defining the property of the meme name , caption , url

// Schema type
const Schema = new mongoose.Schema({
    name: String,
    caption: String,
    url: String
} , {timestamps: true});

// converting Schema to a usable model
const uploadModel = mongoose.model('xmeme' , Schema);

// exporting to the express app 
module.exports = uploadModel;