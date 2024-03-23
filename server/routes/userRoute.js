const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const user = await newUser.save();

    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        _id: user._id,
        
      };
      res.send(user);
    } else {
      return res.status(400).json({ message: "User Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;