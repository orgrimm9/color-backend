const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, "fullname not provided "],
  },
  password: {
    type: String,
    required: true,
  },
  color: {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'Users'});

module.exports = mongoose.model("User", userSchema);
