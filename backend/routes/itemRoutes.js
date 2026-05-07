const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// 👉 GET all items
router.get("/", async (req, res) => {

  try {

    const items = await Item.find();

    res.json(items);

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: "Server Error" });

  }

});

// 👉 POST new item
router.post("/", async (req, res) => {

  try {

    const newItem = new Item(req.body);

    await newItem.save();

    res.status(201).json(newItem);

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: "Add failed" });

  }

});

router.put("/:id", async (req, res) => {

  try {

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);

  } catch (err) {

    console.log(err);

    res.status(500).json({ error: err.message });

  }

});

// 👉 DELETE item
router.delete("/:id", async (req, res) => {

  try {

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted ✅" });

  } catch (err) {

    console.log(err);

    res.status(500).json({ message: "Delete failed" });

  }

});

module.exports = router;