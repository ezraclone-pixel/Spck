const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- STATIC FRONTEND ----------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------- MONGODB CONNECT ----------------
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

// ---------------- BASIC ROUTE ----------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- SAMPLE API TEST ----------------
app.get("/api", (req, res) => {
  res.json({ message: "API Working 🚀" });
});

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
