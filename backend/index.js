const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const connectDB = require("./db/connectDB");
connectDB();
const authRouter= require("./routes/authRouter");

app.get("/", (req, res) => {
    res.send("Hello from Auth Server!");
});

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})