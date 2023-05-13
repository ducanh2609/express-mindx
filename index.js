const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const jwt = require('jsonwebtoken')
const { users, userModel } = require('./models/user')
const bcrypt = require('bcrypt')
const { songRouter } = require('./routes/song')

const app = express()

app.use(express.json())

const authenticationCheck = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, '123@lol');
    const { username } = decoded
    // Check user co trong co so du lieu khong 
    const user = await userModel.findOne({ username: username }).populate('songs').select('username')

    if (user) {
        req.user = user
        next()
    } else {
        res.send('User khong ton tai')
    }
}

app.use('/users', authenticationCheck, userRouter)
app.use('/songs', authenticationCheck, songRouter)

app.get('/', (req, res) => {
    res.send('Home router')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    //check trong db
    const user = await userModel.findOne({ username })
    //nếu có user thì trả token , còn không thì trả lỗi
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username: username }, '123@lol')
        // Tra token cho client
        res.send({ token: token })
    } else {
        res.send('khong tim thay')
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    // check trùng username trong db 
    const existringUser = await userModel.findOne({ username })
    // nếu trùng thì không cho tạo , nếu không trùng thì tạo user 
    // tim user có usename == req.body.username
    // nếu tồn tại thì res.send('user da ton tại )
    // nếu ko thì create
    if (existringUser) {
        res.send('user ton tại')
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt)
        const user = await userModel.create({ username, password: hashPassword, role: ['user'] })
        res.send(user)
    }

})

app.put('/update', async (req, res) => {
    const { username, password } = res.body
})

app.listen(3000)
console.log('Server running')

module.exports = app;