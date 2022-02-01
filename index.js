const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

//----- USE DOTENV LIB------//
dotenv.config();

//------------- For Connection to DataBase-----------//
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//-------INITIALIZE APP-------//
const app = express();

//-------------MIDDLEWARES---------------//
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

//------------LISTEN FOR CHANGE-----------//
app.listen(8800, () => {
  console.log("Backend server is running");
});
