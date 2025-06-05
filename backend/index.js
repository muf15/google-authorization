const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const connectDB = require("./db/connectDB");
connectDB();
const authRouter= require("./routes/authRouter");

// Middleware to parse incoming JSON payloads in requests (Converts JSON string to JavaScript object)
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Hello from Auth Server!");
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})