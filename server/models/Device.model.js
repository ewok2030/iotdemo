import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: null,
    required: false,
  },
  tags: [String],
});

export default mongoose.model('Device', deviceSchema);
