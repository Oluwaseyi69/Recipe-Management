
const User = require('../models/User.Models');

const createUser = async (req, res) => {
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
};

module.exports = {
  createUser
};
