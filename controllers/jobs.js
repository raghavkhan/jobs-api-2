const User = require('../models/User');
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  const { id, name } = req.user;
  console.log(id, name, 'ID AND NAME');
  const details = await User.findOne({ _id: id });
  console.log(details, 'DETAILS');
  // if (!details){
  res.send('getAllJobs');
};
const getJob = async (req, res) => {
  res.send('getJob');
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create(req.body);
  res.json({ job });
  // res.json(req.body);
};
const updateJob = async (req, res) => {
  res.send('job updated');
};
const deleteJob = async (req, res) => {
  res.send('job deleted');
};
module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
