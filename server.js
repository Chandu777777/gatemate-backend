const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://22pa1a5745_db_user:Chandu%405759@cluster0.fgj4bwx.mongodb.net/gatemate?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const gateSchema = new mongoose.Schema({

  gateId: String,
  angle: Number,
  status: String,

  lat: {
    type: Number,
    default: 0
  },

  lng: {
    type: Number,
    default: 0
  },

  time: {
    type: Date,
    default: Date.now
  }

});

const Gate = mongoose.model("Gate", gateSchema);

/* Store or Update Gate Data */

app.post("/update-gate", async (req, res) => {

  try {

    const { gateId, angle, status, lat, lng } = req.body;

    await Gate.findOneAndUpdate(
      { gateId: gateId },
      { angle, status, lat, lng, time: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).send("Gate data updated successfully");

  } catch (error) {

    console.error(error);
    res.status(500).send("Error storing gate data");

  }

});

/* Get Gate Data */

app.get("/gate-data", async (req, res) => {

  try {

    const data = await Gate.find();

    res.json(data);

  } catch (error) {

    res.status(500).send("Error fetching data");

  }

});

/* Test Route */

app.get("/", (req, res) => {

  res.json("Backend Connected Successfully");

});

/* Server */

app.listen(5000, () => {

  console.log("Server running on port 5000");

});