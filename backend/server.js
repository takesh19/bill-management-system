const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const billRoutes = require("./routes/billRoutes");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/bills",billRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

