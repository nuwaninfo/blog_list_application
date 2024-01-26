const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')

const url = config.MONGODB_URI

mongoose.connect(url)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
