// Require necessary packages
const express = require('express')
const mongoose = require('mongoose')

// Initialize Express app
const app = express()

// Connect to MongoDB Atlas cluster
mongoose
  .connect(
    'mongodb+srv://nuwaninfo:fernando45@cluster0.c8xljds.mongodb.net/testblog?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB Atlas')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error)
  })

// Define Mongoose Schema and Model
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: String,
  email: String,
})
const User = mongoose.model('User', userSchema)

// Define routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/users', async (req, res) => {
  try {
    const newUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
    })
    await newUser.save()
    res.json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId)
    console.log('delete user', deletedUser)

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    // If the user is successfully deleted, send a success response
    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    // Handle errors
    console.error('Error deleting user:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
