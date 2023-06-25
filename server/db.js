// eslint-disable-line global-require
const mongoose = require('mongoose');
require("dotenv").config();
const mongoURI = process.env.MONGO_URI;

const connectToMongo = ()=>{
    try {
        mongoose.connect(mongoURI)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;