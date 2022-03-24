const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

loginRouter.get('/',async (req,res)=>{
    const result = await User.find({}).populate('blogs')
    res.json(result)
})

loginRouter.post('/', async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user !== null) {
        const passCorr = await bcrypt.compare(password, user.passHash)
        if (passCorr) {
            const userToken = {
                username,
                id: user._id
            }
            const token = await jwt.sign(userToken, process.env.SECRET,{
                expiresIn: 60*60
            })
            return res.status(200).send({ token, username })
        }
    }
    res.status(401).send({ error: 'invalid username or password' })
})

module.exports = loginRouter