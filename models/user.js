const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mindx:mindx@ducanhtest.s9kqzds.mongodb.net/mindx')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: [String],
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs' }]
})

const userModel = mongoose.model('users', userSchema)

module.exports = { userModel }