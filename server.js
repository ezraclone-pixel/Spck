const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ---------------- MONGO (ONLY ONCE) ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ---------------- SCHEMA ----------------
const UserSchema = new mongoose.Schema({
    id: Number,
    name: String,
    username: String,
    points: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    lastClaim: { type: Number, default: 0 },
    refBy: Number
});

const OrderSchema = new mongoose.Schema({
    orderId: Number,
    userId: Number,
    service: String,
    amount: Number,
    link: String,
    status: String
});

const WithdrawSchema = new mongoose.Schema({
    id: Number,
    userId: Number,
    amount: Number,
    phone: String,
    method: String,
    status: String
});

const User = mongoose.model("User", UserSchema);
const Order = mongoose.model("Order", OrderSchema);
const Withdraw = mongoose.model("Withdraw", WithdrawSchema);

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {

    const { id, first_name, username, ref } = req.body;

    let user = await User.findOne({ id });

    if (!user) {

        user = new User({
            id,
            name: first_name,
            username,
            refBy: ref || null
        });

        await user.save();

        if (ref) {
            await User.updateOne(
                { id: ref },
                { $inc: { points: 1000, referrals: 1 } }
            );
        }
    }

    res.json({ success: true });
});

// ---------------- DAILY CLAIM ----------------
app.post("/claim-daily", async (req, res) => {

    const user = await User.findOne({ id: req.body.id });

    if (!user) {
        return res.json({ success: false, msg: "User not found" });
    }

    const now = Date.now();
    const day = 86400000;

    if (now - user.lastClaim < day) {
        return res.json({
            success: false,
            msg: "Already claimed today"
        });
    }

    user.points += 500;
    user.lastClaim = now;

    await user.save();

    res.json({
        success: true,
        points: user.points
    });
});

// ---------------- ORDER ----------------
app.post("/order", async (req, res) => {

    const order = new Order({
        orderId: Date.now(),
        userId: req.body.id,
        service: req.body.service,
        amount: req.body.amount,
        link: req.body.link,
        status: "Pending"
    });

    await order.save();

    res.json({ success: true });
});

// ---------------- MY ORDERS ----------------
app.post("/my-orders", async (req, res) => {

    const orders = await Order.find({ userId: req.body.id });

    res.json(orders);
});

// ---------------- WITHDRAW ----------------
app.post("/withdraw", async (req, res) => {

    const user = await User.findOne({ id: req.body.id });

    if (!user) {
        return res.json({ success: false, msg: "User not found" });
    }

    if (user.points < req.body.amount) {
        return res.json({
            success: false,
            msg: "Not enough points"
        });
    }

    user.points -= req.body.amount;
    await user.save();

    const withdraw = new Withdraw({
        id: Date.now(),
        userId: user.id,
        amount: req.body.amount,
        phone: "09669597701",
        method: "KPay",
        status: "Pending"
    });

    await withdraw.save();

    res.json({ success: true });
});

// ---------------- LEADERBOARD ----------------
app.get("/leaderboard", async (req, res) => {

    const users = await User.find().sort({ points: -1 });

    res.json(users);
});

// ---------------- START ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT " + PORT);
});