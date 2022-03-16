const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')

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


beforeAll(async () => {
    await Blog.deleteMany({})
    const blogsPromises = blogs.map(blog => new Blog(blog).save())
    const PromiseAll = await Promise.all(blogsPromises)
    const result = await api.get('/api/blogs')
    expect(result.body.length).toBe(blogs.length)
})

describe('api supertests', () => {
    test('checked fetched blogs are correct', async () => {
        const fetched = await api.get('/api/blogs')
        expect(fetched.body.length).toBe(blogs.length)
    })
    test('check id exists for all blogs', async () => {
        const fetched = await api.get('/api/blogs')
        const blogs = fetched.body
        expect(blogs.every((blog) => blog.id)).toBeDefined()
    })
    test('succesfully create new blog', async () => {
        const newBlog = {
            title: "Google",
            author: "Google Inc.",
            url: "https://www.google.com/",
            likes: 0,
        }
        const response = await api.post('/api/blogs').send(newBlog).expect(201)
        expect(response.body.title).toEqual(newBlog.title)
    })
    test('likes default to 0', async () => {
        const newBlog = {
            title: "Google",
            author: "Google Inc.",
            url: "https://www.google.com/"
        }
        const response = await api.post('/api/blogs').send(newBlog).expect(201)
        expect(response.body.likes).toBe(0)
    })
    test('title missing returns 400', async () => {
        const newBlog = {
            author: "Google Inc.",
            url: "https://www.google.com/"
        }
       await api.post('/api/blogs').send(newBlog).expect(400)
    })
    test('url missing returns 400', async () => {
        const newBlog = {
            title: "Google",
            author: "Google Inc.",
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
    })
    test('deletes first blog properly', async () => {
      await api.delete('/api/blogs/5a422a851b54a676234d17f7').expect(410)
    })
    test.only('updates likes', async () => {
      const updtLikes = {
          likes:20
      }
      const result = await api.patch('/api/blogs/5a422bc61b54a676234d17fc').send(updtLikes)
      expect(result.body.likes).toBe(updtLikes.likes)
    })
    
    
})

describe('dummy test', () => {
    test('dummmy test', () => {
        expect(dummy([])).toBe(1)
    })
})

describe('total likes test', () => {
    test('list with one blog', () => {
        const listWithOneBlog = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }]
        expect(totalLikes(listWithOneBlog)).toBe(5)
    })

    test('empty blog list is 0', () => {
        const Blog = []
        expect(totalLikes(Blog)).toBe(0)
    })

    test('bigger blog list calculated summation of likes ', () => {
        const Blogs = [{
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 10,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 10,
                __v: 0
            }
        ]
        expect(totalLikes(Blogs)).toBe(25)
    })

})

describe('favoriteBlog tests', () => {
    test('single blog', () => {
        const listWithOneBlog = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }]
        expect(favoriteBlog(listWithOneBlog)).toEqual(listWithOneBlog[0])
    })

    test('multiple blogs ', () => {
        expect(favoriteBlog(blogs)).toEqual(blogs[2])
    })

})

describe('mostBlogs test', () => {
    test('Big blog test case ', () => {
        expect(mostBlogs(blogs)).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('mostLikes test', () => {
    test('Big blog test case ', () => {
        expect(mostLikes(blogs)).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})