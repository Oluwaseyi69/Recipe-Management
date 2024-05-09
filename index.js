require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.PASSWORD;




app.get('/', (req, res)=>{
  res.send("Hello from updated API")
})

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@backendbd.xrticny.mongodb.net/Online Recipe?retryWrites=true&w=majority&appName=BackendBd`)
.then(()=>{
  console.log("Connected to Database");
})
.catch(()=>{
  console.log("Connection Failed")
})

app.post('/users', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
});