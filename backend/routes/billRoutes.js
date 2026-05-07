const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// CREATE BILL
router.post("/add", async (req, res) => {
  const bill = new Bill(req.body);
  await bill.save();
  res.send("Bill saved ✅");
});

// GET ALL BILLS
router.get("/", async (req, res) => {
  const bills = await Bill.find();
  res.json(bills);
});

router.post("/", async (req, res) => {
  try {
    // 🔥 generate bill number dynamically
    const lastBill = await Bill.findOne().sort({ billNo: -1 });

    const newBillNo = lastBill ? lastBill.billNo + 1 : 1000;

    // 🔥 add billNo manually
    const newBill = new Bill({
      ...req.body,
      billNo: newBillNo
    });

    await newBill.save();

    res.status(201).json(newBill);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;