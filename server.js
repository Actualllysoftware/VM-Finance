const express = require("express");
const app = express();
const { PORT, MONGO_URI } = require("./config/key");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path")

require('dotenv').config();

//MongoDB connection
mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);
//SCHEMAS
require("./models/loan");
require("./models/book");

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./router/loan"));
app.use(require("./router/book"));

/* -----production-----*/


__dirname = path.resolve()
if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, './build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send("API is Running");
  })
}



//PORT
app.listen(PORT, (err) => {
  if (err) {
    console.log("Server Error" + err);
  } else {
    console.log("Server in running on port: " + PORT);
  }
});
