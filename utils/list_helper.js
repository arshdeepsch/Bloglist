const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0 ? 0 : blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0 ? {} : blogs.reduce((sum, curr) => {
            if (curr.likes > sum.likes) {
                return curr
            } else {
                return sum
            }
        },
        blogs[0]
    )
}

const mostBlogs = (blogs) => {
    const result = _.groupBy(blogs, 'author')
    const final = _.reduce(result, (sum, curr) => {
        if (_.size(sum) > _.size(curr))
            return sum
        else
            return curr
    }, result[_.keys(result)[0]])
    return {
        author: final[0].author,
        blogs: final.length
    }
}

const mostLikes = (blogs) => {
    const result = _.groupBy(blogs, 'author')
    const Likes = []
    const final = _.forEach(result, (val) => {
        Likes.push(_.reduce(val, (sum, curr) => {
            return sum + curr.likes
        }, 0))
    })
    const author = _.keys(result)[Likes.indexOf(Math.max(...Likes))]
    return {
        author: author,
        likes: Math.max(...Likes)
    }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}