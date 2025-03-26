const connectToMongo = require('./db.js');
const express = require('express');
var cors = require('cors');
require("dotenv").config();


// connecting to mongodb
connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', require('./upload.js'));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Everything's up!" });
})


app.listen(port, () => {
  console.log(`welcomint server is listening at http://localhost:${port}`)
})