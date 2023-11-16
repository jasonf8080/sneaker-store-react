import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Please provide a name'],
  },

  lastName:{
    type: String,
    required: [true, 'Please provide a lastname'],
  },

  email:{
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email'
    }
  },

  password:{
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 6,
    select: false
  },


  
})

UserSchema.pre('save', async function(){ //Secures user password to a random string of characters
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.createJWT = function() { //Creates token
    return jwt.sign({userID: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePasswords = async function(correctPassword){ //Check if passwords match
    const isMatch = await bcrypt.compare(correctPassword, this.password);
    return isMatch;
}

export default mongoose.model('User', UserSchema)