const express = require('express');
const app = express();
// const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require('node-cron');


if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({path: "backend/config/config.env"});
}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const user = require('./routes/user');
const wish = require('./routes/wish');
const { mainfunc } = require('./config/mainfunc');

app.use(cors());
app.use("/api/v1", user);
app.use("/api/v1", wish);

cron.schedule('0 0 * * *', () => {
    mainfunc();
}, {
    timezone: "Asia/Kolkata"
});

// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });
module.exports = app;
