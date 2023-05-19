const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.URI


async function connectDB() {
 
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("database connected successfully");
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  
  module.exports = {connectDB};