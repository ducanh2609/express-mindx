const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mindx:mindx@ducanhtest.s9kqzds.mongodb.net/mindx')

const songSchema = new mongoose.Schema({
    name: String,
    author: String
})

const songModel = mongoose.model('songs', songSchema)

module.exports = { songModel }