const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ---------------- Middleware ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- MongoDB Connection ---------------- */

mongoose.connect(
  "mongodb+srv://22pa1a5745_db_user:Chandu%405759@cluster0.fgj4bwx.mongodb.net/gatemate?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.log("MongoDB Connection Error:", err));

/* ---------------- Schema ---------------- */

const gateSchema = new mongoose.Schema({

  gateId: {
    type: String,
    required: true
  },

  angle: Number,

  status: String,

  lat: {
    type: Number,
    default: 16.54376   // default railway gate latitude
  },

  lng: {
    type: Number,
    default: 81.60191   // default railway gate longitude
  },

  time: {
    type: Date,
    default: Date.now
  }

});

const Gate = mongoose.model("Gate", gateSchema);

/* ---------------- Update Gate API ---------------- */

app.post("/update-gate", async (req, res) => {

  try {

    console.log("Incoming Data:", req.body);

    const { gateId, angle, status, lat, lng } = req.body;

    if (!gateId) {
      return res.status(400).send("Gate ID is required");
    }

    await Gate.findOneAndUpdate(
      { gateId: gateId },
      {
        angle: angle,
        status: status,
        lat: lat || 16.54376,
        lng: lng || 81.60191,
        time: Date.now()
      },
      { upsert: true, new: true }
    );

    res.status(200).send("Gate data updated successfully");

  } catch (error) {

    console.error("Update Error:", error);
    res.status(500).send("Error storing gate data");

  }

});

/* ---------------- Get Gate Data API ---------------- */

app.get("/gate-data", async (req, res) => {

  try {

    const data = await Gate.find().sort({ time: -1 });

    res.json(data);

  } catch (error) {

    console.error("Fetch Error:", error);
    res.status(500).send("Error fetching data");

  }

});

/* ---------------- Test Route ---------------- */

app.get("/", (req, res) => {

  res.json({
    message: "GateMate Backend Connected Successfully"
  });

});

/* ---------------- Server ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});