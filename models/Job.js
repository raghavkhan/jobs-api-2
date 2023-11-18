const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending', 'working'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      // type: String,
      ref: 'User',
      // if we don't use ref here it will not create a formal relationship(reference) between collections,
      // it may not provide the same benefits in terms of querying and managing relationships between your data
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

const Model = mongoose.model('Job', JobSchema);

module.exports = Model;
