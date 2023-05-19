const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    otp : {type: Number},
    otptime : { type: String},
    email: { type: String, unique: true },
    blocked: { type: Boolean, default: false },
    wrongAttempts: { type: Number, default: 0 },
  });

  const User = mongoose.model('User', userSchema);

  module.exports = {User};