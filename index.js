require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const User = require('./models/User.Models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Recipe = require('./models/recipe.Models');


const PORT = process.env.PORT;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;





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


app.use(express.json());


app.post('/registerUser', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if(!username || !email || !password || password.length < 6){
      return res.status(500).json({
        error: 'Fields cannot be empty and password must be atleast 6 characters'
      })
    }

    const existingUserByEmail = await User.findOne({ email });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByEmail || existingUserByUsername) {
      return res.status(400).json({ 
        error: 'User already exists or kindly input a unique name or email' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created', user: savedUser });
    } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Error creating user' });
  }
});
app.post('/loginUser', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const loginPasswordHash = crypto.createHash('sha256').update(password).digest('hex');
        if (!loginPasswordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const username = decoded.username;
    console.log(username);
    req.username = username;
    next();
  });
};
app.post('/addRecipes', verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const { recipeName, description, ingredientsName, instructions, category, quantity, unit } = req.body;

    const user = await User.findOne({username})
    
    console.log(username);
    const recipe = new Recipe({
      recipeName,
      description,
      ingredientsName,
      instructions,
      category,
      userId: user.id,
      quantity,
      
    });

    const savedRecipe = await recipe.save();

    res.status(201).json(
      {message: `Recipe Succesfully Added ${username}`,
        data: savedRecipe});
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateRecipe/:id', verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const { id } = req.params;
    const { recipeName, description, ingredientsName, instructions, category, tags } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.userId.toString() !== user.id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (recipeName) recipe.recipeName = recipeName;
    if (description) recipe.description = description;
    if (instructions) recipe.instructions = instructions;
    if (category) recipe.category = category;
    if (Array.isArray(tags)) recipe.tags = tags;

    if (Array.isArray(ingredientsName)) {
      recipe.ingredients = ingredientsName;
    }

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: `Recipe successfully updated by ${username}`,
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.delete('/deleteRecipes/:id', verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.id; 

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(204).json({message: "Successfully deleted"}); 
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/searchRecipes', async (req, res) => {
  try {
    const { ingredientsName, tags, category } = req.query;

    // Build the search query
    const searchQuery = {};

    if (ingredientsName) {
      searchQuery.ingredientsName = { $in: ingredientsName.split(',') };
    }
    if (tags) {
      searchQuery.tags = { $in: tags.split(',') };
    }
    if (category) {
      searchQuery.category = category;
    }

    const recipes = await Recipe.find(searchQuery);

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error searching for recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
});


