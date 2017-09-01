const mongoose = require('mongoose');
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
  reenterPassword: {type: String, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  city: {type: String, required: true},
  state: {type: String, required: true},
});
const Snippet = mongoose.model('Snippet', snippetSchema);
const User = mongoose.model('User', userSchema);
// let snippet = new Snippet({
//   coder: "Ken Coppola",
//   title: "Add Two Numbers",
//   published_date: 8/25/17,
//   body: "function addTwoNumbers(a,b){return a + b;};",
//   notes: "This function will add two numbers",
//   language: "javascript",
//   rating: 1,
//   tags: ["javascript"],
//   user: "ken", ref: "ken",
// });
//
// let user = new User({
//   username: "ken",
//   password: "asd",
//   first_name: "Ken",
//   last_name: "Coppola",
//   city: "Waxhaw",
//   state: "NC",
// });
 // snippet.user = user;
// snippet.save();
// user.save();

module.exports = {
  Snippet: Snippet,
  User: User
};
