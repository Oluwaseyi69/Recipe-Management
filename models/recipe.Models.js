const mongoose = require('mongoose')
// const User = require('./models/User.Models');



const recipeSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,


  recipeName:{
    type: String,
    required: true

  },
  description: {
    type: String,
    required: true

  },
  instructions: {
    type: String,
    required: true

  },
  category:{
    type: String,
    required: true

  },
  ingredients:[
   {
    ingredientsName:{
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    min: 0, 
  },
  unit: {
    type: String,
    trim: true,
  },

  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    // required: true
  },

  tags: {
    type: [String],
    trim: true, 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
  },
  
});
// const Recipe = mongoose.model('Recipe', recipeSchema);
recipeSchema.index({ recipeName: 'text' });

// module.exports = Recipe;
module.exports = mongoose.model('Recipe', recipeSchema);