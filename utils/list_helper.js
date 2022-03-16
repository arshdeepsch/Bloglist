const _ = require('lodash')

const blogs = [{
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

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