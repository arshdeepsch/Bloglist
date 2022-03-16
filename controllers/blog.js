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

blogRouter.delete('/:id', async (request, response) => {
    await Blog.deleteOne({
        id: request.params.id
    })
    response.sendStatus(410)
})

blogRouter.patch('/:id', async (request, response, next) => {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, {
        new: true
    })
    response.json(result)
})


module.exports = blogRouter