const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email, password });
      if (admin) {
        res.json({ isAdmin: true, user: admin });
      } else {
        return res.status(400).json({ message: "Admin Login Failed" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });

  module.exports = router;