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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
