const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  const formattedBlogs = blogs.map((blog) => {
    return {
      url: blog.url,
      title: blog.title,
      author: blog.author,
      user: {
        username: blog.user,
      },
      likes: blog.likes,
      id: blog._id,
    }
  })
  response.status(200).json(formattedBlogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const userId = request.user.id

  if (!userId) {
    return response.status(401).json({ error: 'Unauthorized' })
  }
  const user = await User.findById(userId)

  if (body.title === undefined || body.url === undefined) {
    response
      .status(400)
      .json({ error: 'Bad Request 1', message: 'Missing required property' })
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      // Get the user id from the token
      const userId = request.user.id
      if (!userId) {
        return response.status(401).json({ error: 'token invalid' })
      }

      // Get the uer id from the blog
      const blog = await Blog.findById(request.params.id)

      if (userId === blog.user.toString()) {
        const result = Blog.findByIdAndDelete(request.params.id)
        if (!result) {
          return response.status(404).json({ error: 'User not found' })
        }

        response.status(204).end()
      } else {
        response.status(401).json({ error: 'Unauthorized access' })
      }
    } catch (exception) {
      next(exception)
    }
  }
)

blogsRouter.put(
  '/:id',
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const body = request.body
      const blogId = request.params.id
      const userId = request.user.id

      const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: userId,
      }

      const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, {
        new: true,
      })

      response.json(updatedBlog)
    } catch (error) {
      next(error)
    }
  }
)

module.exports = blogsRouter
