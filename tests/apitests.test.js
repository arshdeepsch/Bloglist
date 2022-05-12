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
const User = require('../models/user')

const blogs = [{
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
},
{
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
},
{

    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
},
{
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
},
{
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
},
{
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
}
]

let auth = ' ';

beforeAll(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    const initUser = {
        username: "test",
        password: "test"
    }
    const resultUser = await api.post('/api/users').send(initUser)
    const resultLogin = await api.post('/api/login').send(initUser)
    auth = resultLogin.body.token
    const blogsPromises = blogs.map(blog => api.post('/api/blogs').set('Authorization', `Bearer ${auth}`).send(blog))
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
        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${auth}`).send(newBlog).expect(201)
        expect(response.body.title).toEqual(newBlog.title)
    })
    test('likes default to 0', async () => {
        const newBlog = {
            title: "Google",
            author: "Google Inc.",
            url: "https://www.google.com/"
        }
        const response = await api.post('/api/blogs').set('Authorization', `Bearer ${auth}`).send(newBlog).expect(201)
        expect(response.body.likes).toBe(0)
    })
    test('title missing returns 400', async () => {
        const newBlog = {
            author: "Google Inc.",
            url: "https://www.google.com/"
        }
        await api.post('/api/blogs').set('Authorization', `Bearer ${auth}`).send(newBlog).expect(400)
    })
    test('url missing returns 400', async () => {
        const newBlog = {
            title: "Google",
            author: "Google Inc.",
        }
        await api.post('/api/blogs').set('Authorization', `Bearer ${auth}`).send(newBlog).expect(400)
    })
    test('deletes first blog properly', async () => {
        const blog = await api.get('/api/blogs')
        const id = blog.body[0].id
        await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${auth}`).expect(410)
    })
    test('updates likes', async () => {
        const blogs = await api.get('/api/blogs')
        const updtLikes = {
            likes: 20
        }
        const result = await api.patch(`/api/blogs/${blogs.body[0].id}`).send(updtLikes)
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
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
        }]
        expect(totalLikes(listWithOneBlog)).toBe(5)
    })

    test('empty blog list is 0', () => {
        const Blog = []
        expect(totalLikes(Blog)).toBe(0)
    })

    test('bigger blog list calculated summation of likes ', () => {
        const Blogs = [{
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10,
        },
        {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 10,
        }
        ]
        expect(totalLikes(Blogs)).toBe(25)
    })

})

describe('favoriteBlog tests', () => {
    test('single blog', () => {
        const listWithOneBlog = [{
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
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