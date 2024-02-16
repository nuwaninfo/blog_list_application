const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const logger = require('../utils/logger')

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    console.log('delete many')

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nuwanf',
      name: 'Nuwan Fernando',
      password: '123456',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const username = usersAtEnd.map((u) => u.username)
    expect(username).toContain(newUser.username)
  })
})

test('test the username uniqness', async () => {
  const newUser = {
    username: 'nuwanf',
    name: 'Nuwan Fernando',
    password: '123456',
  }

  const message = await api.post('/api/users').send(newUser).expect(400)
  expect(message.body.error).toBe('User already exists')
})

test('test when username is missing', async () => {
  const newUser = {
    username: '',
    password: '123456',
    name: 'Nuwan Fernando',
  }

  const message = await api.post('/api/users').send(newUser).expect(400)
  expect(message.body.error).toBe('Both username and password are required')
})

test('test when password is missing', async () => {
  const newUser = {
    username: 'anil',
    password: '',
    name: 'Nuwan Fernando',
  }

  const message = await api.post('/api/users').send(newUser).expect(400)
  expect(message.body.error).toBe('Both username and password are required')
})

test('test when username has length less than 3', async () => {
  const newUser = {
    username: 'an',
    password: '123456',
    name: 'Nuwan Fernando',
  }

  const message = await api.post('/api/users').send(newUser).expect(400)
  expect(message.body.error).toBe(
    'Both username and password must be at least 3 characters long'
  )
})

test('test when password has length less than 3', async () => {
  const newUser = {
    username: 'bimal',
    password: '11',
    name: 'Nuwan Fernando',
  }

  const message = await api.post('/api/users').send(newUser).expect(400)
  expect(message.body.error).toBe(
    'Both username and password must be at least 3 characters long'
  )
})

afterAll(async () => {
  await mongoose.connection.close()
})
