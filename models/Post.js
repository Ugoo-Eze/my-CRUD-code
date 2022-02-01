const mongoose = require("mongoose");

//--------POST SCHEMA----------//
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  // update timestamps when user is created or updated
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
