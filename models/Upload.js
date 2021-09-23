const mongoose = require('mongoose');

const Studentshecma = new mongoose.Schema({
   image: {type:String,required:true}

  },{timestamps:true});
  const Upload = mongoose.model('Upload', Studentshecma);
  module.exports = Upload;