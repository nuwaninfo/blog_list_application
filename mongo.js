const mongoose = require('mongoose')

// const url = 'mongodb+srv://nuwaninfo:fernando45@cluster0.c8xljds.mongodb.net/noteApp?retryWrites=true&w=majority'
const url =
  'mongodb+srv://nuwaninfo:fernando45@cluster0.c8xljds.mongodb.net/testblog?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'Blog 1',
  author: 'Nuwan',
  url: 'www.google.com',
  likes: 20,
})

/*blog.save().then((result) => {
  console.log('blog saved!')
})*/

console.log('blog')
Blog.find({}).then((result) => {
  result.forEach((blog) => {
    console.log(blog)
  })
  mongoose.connection.close()
})
