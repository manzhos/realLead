import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  userFirstName: {
    type: String,
    trim: true,
    required: false,
  },
  userLastName: {
    type: String,
    trim: true,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // phone: {
  //   type: String,
  //   trim: true,
  // },
  // address: {
  //   type: String,
  //   trim: true,
  // },
  // country: {
  //   type: String,
  //   trim: true,
  // },
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model('User', userSchema);
