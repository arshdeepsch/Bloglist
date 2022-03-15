const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (req, res, next) => {
    Blog.find({}).then(blogs => {
        res.json(blogs)
    })
})

blogRouter.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        }).catch(
            error => next(error)
        )
})


module.exports = blogRouter