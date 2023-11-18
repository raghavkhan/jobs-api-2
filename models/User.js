const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// create the schema for user
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a valid name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter a valid password'],
    minLength: 6,
  },
});

UserSchema.methods.createJWT = function () {
  console.log(`userId: ${this._id} --------- USERID IN JWT SIGN`);
  // return jwt.sign({ name: 'tarun', id: 786 }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_LIFETIME,
  // });
  return jwt.sign(
    { name: this.name, userId: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (requestedPassword) {
  // compare the hashed password with the plain text password provided by the user
  console.log(this.password, 'THIS.PASSWORD');
  console.log(requestedPassword, 'THIS.HASH');

  const isMatch = await bcrypt.compare(requestedPassword, this.password);
  console.log(isMatch, 'ISMATCH');
  return isMatch;
  // return await bcrypt.compare(this.password, this.hash);
};

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const Model = mongoose.model('User', UserSchema);
module.exports = Model;
