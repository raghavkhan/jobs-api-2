// const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors/index');
const { modelNames } = require('mongoose');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided');
  }
  let token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // also we can use,
    // const user = User.findById(payload.id).select("-password");
    // req.user = user;

    const { userId, name } = payload;
    req.user = { userId, name };
    // or,directly
    // req.user = {id: payload.id, name: payload.name}
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
};

module.exports = authenticationMiddleware;

