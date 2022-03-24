const userRouter = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

userRouter.post('/', async (req, res) => {
    const { username, password } = req.body;
    if(password.length < 3 || username.length < 3){
        return res.send({error: 'password and username should have a minimum of 3 letters'})
    }
    if (await User.findOne({ username }) === null) {
        const passHash = await bcrypt.hash(password, 10);
        const user = new User({ username, passHash });
        const savedUser = await user.save();
        return res.status(201).json(savedUser)
    }
    res.send({error: "invalid username"})
})

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { user: 0 })
    res.json(users)
})

module.exports = userRouter