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

const mostLikes = (blogs) => {
  const mostLikesObj = blogs.reduce((acc, curr) => {
    acc[curr.author] = (acc[curr.author] || 0) + curr.likes
    return acc
  }, {})

  let maxProperty
  let maxValue = -Infinity

  for (const [prop, value] of Object.entries(mostLikesObj)) {
    if (value > maxValue) {
      maxProperty = prop
      maxValue = value
    }
  }

  return { author: maxProperty, likes: maxValue }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
