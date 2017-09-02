const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const snippetSchema = new mongoose.Schema({
coder: {type: String, required: true},
title: {type: String, required: true, unique: true},
published_date: {type: Date, required: true},
updated_date: {type: Date},
body: {type: String, required: true},
notes:{type: String, required: true},
language: {type: String, required: true},
rating: {type: Number},
tags: {type: Array, required: true},
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});
const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  reenterPassword: {type: String},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
});

// authenticate input against database documents
userSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({username: username})
    .exec(function(error, user) {
      if (error) {
        return callback(error);
      } else if (!user) {
        let error = new Error ('User not found');
        error.status = 401;
        return callback(error);
      }
      bcrypt.compare(password, user.password, function (error, result)
      {
        if (result === true){
          return callback(null, user);
        } else {
          return callback();
        }
        })
      });
    };
//hash password
userSchema.pre('save', function(next){
 let user = this;
 bcrypt.hash(user.password, 10, function(err, hash) {
   if (err) {
     return next(err);
}
   user.password = hash;
   next();
 })
});
const Snippet = mongoose.model('Snippet', snippetSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Snippet: Snippet,
  User: User
};
