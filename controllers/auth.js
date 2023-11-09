const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

// errors
const UnauthenticatedError = require('../errors/unauthenticated');
const BadRequestError = require('../errors/bad-request');

const register = async (req, res) => {
  //  need to hash password with bcrypt before CREATE otherwise use it in pre ,mongoose middleware
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // we can also do it in mongoose middleware with pre because we need to hash password before actually interacting
  // with the database
  // console.log(hashedPassword);
  //creating user with model User
  const user = await User.create({
    ...req.body,
    // password: hashedPassword,//no need of this with middleware
  });

  // storing token by calling method which we define with
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError(
      'Please register first and then try to login'
    );
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('Password Incorrect! ');
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
