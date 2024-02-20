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

test('there are four blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(4)
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
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im51d2FuZiIsImlkIjoiNjVkNDc5MmFjZTkxNjQyYWI0ZDllZGRjIiwiaWF0IjoxNzA4NDI0Mzk4fQ.PVflqEKmgZfLnhDtOcmrau-52q3Q1cw5JGEX1oAp3z4'
    )
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

  await api
    .post('/api/blogs')
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im51d2FuZiIsImlkIjoiNjVkNDc5MmFjZTkxNjQyYWI0ZDllZGRjIiwiaWF0IjoxNzA4NDI0Mzk4fQ.PVflqEKmgZfLnhDtOcmrau-52q3Q1cw5JGEX1oAp3z4'
    )
    .send(newBlog)
    .expect(201)

  const response = await api.get('/api/blogs')
  const lastBlog = response.body[response.body.length - 1]

  expect(lastBlog.likes).toBe(0)
})

test('verify that if the title or url properties are missing from the request data', async () => {
  const newBlog = {
    author: 'DiJavaScript Todaypal Bhavsar',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im51d2FuZiIsImlkIjoiNjVkNDc5MmFjZTkxNjQyYWI0ZDllZGRjIiwiaWF0IjoxNzA4NDI0Mzk4fQ.PVflqEKmgZfLnhDtOcmrau-52q3Q1cw5JGEX1oAp3z4'
    )
    .send(newBlog)
    .expect(400)
})

test('creates a new blog post without token', async () => {
  const initialBlogs = await api.get('/api/blogs')

  const newBlog = {
    title: 'Node js 21: Pioneering the Future of Development',
    author: 'Dipal Bhavsar',
    url: 'https://www.bacancytechnology.com/blog/whats-new-in-node-js-21',
    likes: 20,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[7]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im51d2FuZiIsImlkIjoiNjVkNDc5MmFjZTkxNjQyYWI0ZDllZGRjIiwiaWF0IjoxNzA4NDI0Mzk4fQ.PVflqEKmgZfLnhDtOcmrau-52q3Q1cw5JGEX1oAp3z4'
      )
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1)

    const titles = blogsAtEnd.body.map((r) => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updation of a blog', () => {
  test('succeeds with equal the sending likes', async () => {
    const updatedLikes = { likes: 30 }

    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)

    expect(updatedBlog.body.likes).toBe(30)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
