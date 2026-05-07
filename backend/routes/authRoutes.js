const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");


// 🔥 REGISTER
router.post("/register", async (req, res) => {

  try {

    const { name, email, password, shopName } = req.body;

    const existing = await Admin.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashed,
      shopName
    });

    await admin.save();

    res.json({
      message: "Admin created ✅"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});


// 🔥 LOGIN
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid email"
      });
    }

    const match = await bcrypt.compare(
      password,
      admin.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id
      },
      "SECRETKEY123",
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        shopName: admin.shopName
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

module.exports = router;