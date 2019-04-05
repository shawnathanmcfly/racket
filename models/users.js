var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RacketSchema = new Schema({

  user: {
    type: String,
    required: true
  },

  pass: {
    type: String,
    required: true
  },

  frags: {
    type: Number,
    required: true
  }

});

var Racket = mongoose.model("Racket", RacketSchema);

module.exports = Racket;
