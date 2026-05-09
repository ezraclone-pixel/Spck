const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// ------------------ STATIC FRONTEND ------------------
// Render မှာ path လွဲတတ်လို့ path.resolve သုံးပြီး တိကျအောင် လုပ်ထားပါတယ်
app.use(express.static(path.resolve(__dirname, "public")));

// ------------------ MONGODB CONNECT ------------------
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

// ------------------ SAMPLE API TEST ------------------
app.get("/api", (req, res) => {
    res.json({ message: "API Working 🚀" });
});

// ------------------ BASIC ROUTE (FRONTEND) ------------------
// အပေါ်က route တွေနဲ့ မဆိုင်တဲ့ ကျန်တဲ့ request အားလုံးကို index.html ဆီ ပို့ပေးမှာပါ
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// ------------------ SERVER START ------------------
// Render အတွက် PORT 10000 ကို ဦးစားပေး သုံးထားပါတယ်
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
