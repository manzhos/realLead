import mongoose from 'mongoose';
import {Schema, model, Types} from 'mongoose';
mongoose.Promise = global.Promise;

const projectSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  // id: {
  //   type: Number,
  //   trim: true,
  //   unique: true,
  //   required: true,
  // },
  name: {
    type: String,
    trim: true,
    required: false,
  },
  ownerId: {
    type: Types.ObjectId, 
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model('Project', projectSchema);
