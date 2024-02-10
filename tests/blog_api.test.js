const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(2)
})

test('check whether unique identifier property of the blog posts is id', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('creates a new blog post', async () => {
  const initialBlogs = await api.get('/api/blogs')

  const newBlog = {
    title: 'Node js 21: Pioneering the Future of Development',
    author: 'Dipal Bhavsar',
    url: 'https://www.bacancytechnology.com/blog/whats-new-in-node-js-21',
    likes: 20,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const blogTitles = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(initialBlogs.body.length + 1)
  expect(blogTitles).toContain(
    'Node js 21: Pioneering the Future of Development'
  )
})

test('verifies that if the likes property is missing from the request', async () => {
  const newBlog = {
    title: '5 Common Server Vulnerabilities with Node.js',
    author: 'DiJavaScript Todaypal Bhavsar',
    url: 'https://blog.javascripttoday.com/blog/node-js-server-vulnerabilities/',
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const response = await api.get('/api/blogs')
  const lastBlog = response.body[response.body.length - 1]

  expect(lastBlog.likes).toBe(0)
})

afterAll(async () => {
  await mongoose.connection.close()
})
