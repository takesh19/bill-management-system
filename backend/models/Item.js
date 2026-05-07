const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  services: {
    Dry: Number,
    Steam: Number,
    Wash: Number,
    RollingPress: Number
  }

});

module.exports = mongoose.model("Item", itemSchema);