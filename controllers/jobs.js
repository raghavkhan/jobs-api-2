const User = require('../models/User');
const Job = require('../models/Job');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// const { model } = require('mongoose');

// const getAllJobs = async (req, res) => {
//   const { id, name } = req.user;
//   console.log(id, name, 'ID AND NAME');
//   const details = await User.findOne({ _id: id });
//   console.log(details, 'DETAILS');
//   // if (!details){
//   // res.send('getAllJobs');
//   res.json({details});
// };
const getAllJobs = async (req, res) => {
  const { userId, name } = req.user;
  const allJobsForAuthorizedUser = await Job.find({
    createdBy: req.user.userId,
  }).sort('createdAt');
  if (!allJobsForAuthorizedUser.length) {
    res.send('No jobs for that particular user');
  } else
    res.json({
      allJobsForAuthorizedUser,
      count: allJobsForAuthorizedUser.length,
    });
};

const getJob = async (req, res) => {
  // res.send('getJob');
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`cannot find job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.json({ job });
  // res.json(req.body);
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;

  if ((company === '', position === '')) {
    throw new BadRequestError(`Company or position fields cannot be empty`);
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { runValidators: true, new: true }
  );
  if (!job) {
    throw new NotFoundError(`cannot find job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`cannot find job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
  // res.send('job deleted');
};
module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
