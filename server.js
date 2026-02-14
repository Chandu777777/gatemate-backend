const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

/* ---------------- Middlewares ---------------- */

app.use(cors());
app.use(bodyParser.json());

/* ---------------- MongoDB Connection ---------------- */

mongoose
  .connect(
    "mongodb+srv://22pa1a5745_db_user:Chandu%405759@cluster0.fgj4bwx.mongodb.net/gatemate?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(" MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

/* ---------------- Schema ---------------- */

const gateSchema = new mongoose.Schema({
  gateId: String,
  angle: Number,
  status: String,
  time: {
    type: Date,
    default: Date.now,
  },
});

const Gate = mongoose.model("Gate", gateSchema);

/* ---------------- API to Store Data ---------------- */

app.post("/update-gate", async (req, res) => {
  try {
    const { gateId, angle, status } = req.body;

    const newGateData = new Gate({
      gateId,
      angle,
      status,
    });

    await newGateData.save();

    res.status(200).send("Gate data stored successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error storing gate data");
  }
});

/* ---------------- API to Retrieve Data ---------------- */

app.get("/gate-data", async (req, res) => {
  try {
    const data = await Gate.find().sort({ time: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

/* ---------------- Server ---------------- */

app.listen(5000, () => {
  console.log(" Server running on port 5000");
});
