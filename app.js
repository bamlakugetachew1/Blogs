const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const userroutes = require("./routes/userroutes");
const postroutes = require("./routes/postroute");
const app = express();
app.use(cors({ credentials: true, origin: "https://blogethiopia.netlify.app" }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("combined"));
app.use("/api", userroutes);
app.use("/api", postroutes);
module.exports = app;
