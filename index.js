const express = require('express');

const app = express();
const Port = 5000;
const {connectDB} = require('./config/db');
const {User} = require('./model/user');
connectDB();
app.use(express.json());

const jwt = require('jsonwebtoken');
const moment = require('moment');

// lets now handle the api to generate the otp
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); 
}

function generateJwtToken(email) {
  const secretKey = 'Pankaj'; // Replace with your secret key
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  return token;
}

const options = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

// // api to generate the otp and send back to the user
app.post('/generate-otp', async (req, res) => {
  const { email } = req.body;

  const otp = generateOTP();
  const user = await User.findOne({ email });
   if(user)
   {
      const x = moment().format("YYYY-MM-DD HH:mm:ss");
      const dateObj = new Date(x)
      const y = new Date(user.otptime);
      const timeDifferenceInMilliseconds = dateObj-y;
      const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60);
      if(timeDifferenceInMinutes<=1)
      {
        return res.json({message: 'try again after 1 minute'})
      }
      else
      {
         user.otp = otp;
         user.otptime = x;
         user.save();
         return res.json({message : "user updated successfully"})
      }
   }
   
    const wrongAttempts =0;
    const blocked = false;
    // to get the current time in a format
    const otptime = moment().format("YYYY-MM-DD HH:mm:ss");
    await User.create({otp,otptime,email,blocked,wrongAttempts})
  res.json({ message: 'OTP sent successfully' });
});

// lets now handle the login api
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'invalid user' });
    }
    
    
    if (user.blocked) {
      return res.status(403).json({ message: 'User account blocked.' });
    }
    // otp will be invalid after the 5 minute

    
    // Check if the OTP is correct
    if (otp !== user.otp) {
      user.wrongAttempts++;
    }
      
     
      if (user.wrongAttempts >= 5) {
        user.blocked = true;
        await user.save();
        return res.status(403).json({ message: 'User account blocked. ' });
      }
      
    
    // Clear the OTP to prevent reuse
    user.otp = undefined;
    user.wrongAttempts = 0;
    await user.save();
    
    // Generate JWT token (you can use any JWT library or implementation)
    const token = generateJwtToken(email);
    
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(Port , ()=>{
  console.log(`server is listening on the Port ${Port}`);
})