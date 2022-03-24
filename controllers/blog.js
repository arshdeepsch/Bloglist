const blogRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = req => {
    const auth = req.get('authorization')
    if (auth != null && auth.toLowerCase().startsWith('bearer ')) {
        return auth.substring(7)
    }
    return null
}

blogRouter.get('/', async (req, res, next) => {
    const result = await Blog.find({}).populate('user', { username: 1, id: 1 })
    res.json(result)
})

blogRouter.post('/', async (request, response, next) => {
    const user = request.user
    if (user !== null) {
        const blog = new Blog({
            ...request.body,
            user: user._id
        })
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        return response.status(201).json(result)
    }
    response.status(401).send({ error: "invalid token" })
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user
    if (user === null) {
        return response.status(401).send({ error: 'invalid token' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user._id.toString()) {
        const result = await Blog.deleteOne({
            _id: blog._id
        })
        return response.status(410).end()
    }
    response.status(401).send({ error: "invalid token" })
})

blogRouter.patch('/:id', async (request, response, next) => {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
        new: true
    })
    response.json(result)
})


module.exports = blogRouter