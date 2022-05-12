const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        response.status(400).send({
            error: 'malformatted id'
        })
        next(error)
    } else if (error.name === 'ValidationError') {
        response.status(400).json({
            error: error.message
        })
        next(error)
    }
    next(error)
}

const userExtractor = async (request, response, next) => {
    const auth = request.get('authorization')
    console.log(auth)
    if (auth != null && auth.toLowerCase().startsWith('bearer ')) {
        const token = auth.substring(7)
        const decoded = await jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decoded.id)
        if (user === null) {
            request.user = null
            next()
        } else {
            request.user = user
            next()
        }
    } else {
        request.user = null
        next()
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor
}