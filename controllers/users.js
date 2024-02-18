const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'Both username and password are required' })
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'Both username and password must be at least 3 characters long',
    })
  }

  // Check user already exists
  const existingUser = await User.find({ username })

  if (Object.keys(existingUser).length === 1) {
    return response.status(400).json({ error: 'User already exists' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})

module.exports = usersRouter
