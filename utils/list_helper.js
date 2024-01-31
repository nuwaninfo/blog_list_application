const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce((total, item) => {
    return total + item.likes
  }, 0)

  return sum
}

const favoriteBlog = (blogs) => {
  const blogObj = blogs.reduce((maxObj, currObj) => {
    return maxObj.likes > currObj.likes ? maxObj : currObj
  })
  const { _id, url, __v, ...newObj } = blogObj
  return newObj
}

const mostBlogs = (blogs) => {
  const blogCount = _.countBy(blogs, 'author')
  let maxProperty
  let maxValue = -Infinity

  for (const [prop, value] of Object.entries(blogCount)) {
    if (value > maxValue) {
      maxProperty = prop
      maxValue = value
    }
  }

  return { author: maxProperty, blogs: maxValue }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
