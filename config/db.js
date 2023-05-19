const mongoose = require('mongoose');
const uri = "mongodb+srv://pankajkr12022001:pankaj123@cluster0.sgcpl7z.mongodb.net/"


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