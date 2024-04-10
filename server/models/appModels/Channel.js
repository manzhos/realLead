import mongoose from 'mongoose';
import {Schema, model, Types} from 'mongoose';
mongoose.Promise = global.Promise;

const channelSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  channelId: {
    type: Number,
    trim: true,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: false,
  },
  projectId: {
    type: Types.ObjectId, 
    ref: 'Project'
  },
  linkFrom: {
    type: String,
    trim: true,
    required: false,
  },
  linkTo: {
    type: String,
    trim: true,
    required: false,
  },
  click: {
    type: Number,
    trim: true,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model('Channel', channelSchema);

