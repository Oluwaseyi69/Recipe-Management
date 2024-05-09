require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/User.Models');
// const bodyParser = require('body-parser');


const PORT = process.env.PORT;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.PASSWORD;




app.get('/', (req, res)=>{
  res.send("Hello from updated API")
})

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@backendbd.xrticny.mongodb.net/OnlineRecipe?retryWrites=true&w=majority&appName=BackendBd`)
.then(()=>{
  console.log("Connected to Database");
})
.catch(()=>{
  console.log("Connection Failed")
})

// // If using body-parser:
// app.use(bodyParser.json());

// If using express.json():
app.use(express.json());


app.post('/registerUser', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
});




// const express = require('express');
// const app = express();
// const userController = require('./controllers/userControllers');
// const mongoose = require('mongoose');

// const PORT = process.env.PORT;
// const USERNAME = process.env.DB_USERNAME;
// const PASSWORD = process.env.PASSWORD;

//  mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@backendbd.xrticny.mongodb.net/Online Recipe?retryWrites=true&w=majority&appName=BackendBd`)
// .then(()=>{
//   console.log("Connected to Database");
// })
// .catch(()=>{
//   console.log("Connection Failed")
// })



// app.use(express.json());

// // Register the user creation endpoint with the controller function
// app.post('/users', userController.createUser);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });