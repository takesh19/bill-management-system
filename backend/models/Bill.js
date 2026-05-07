const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNo: Number,
  name: String,
  mobile: String,
  items: Array,
  total: Number,
  discount: Number,
  final: Number,
  paid: Number,
  balance: Number,
  payment: String,
  delivery: String,
  date: String,
});

module.exports = mongoose.model("Bill", billSchema);