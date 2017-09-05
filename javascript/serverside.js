const express = require('express');
const mustache = require('mustache-express');
const Snippet = require('./schema.js').Snippet;
const User = require('./schema.js').User;
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');
mongoose.connect('mongodb://localhost:27017/snippets');
mongoose.Promise = require('bluebird');
const server = express();
server.use(express.static('../public'));
server.set('views', __dirname + '/../views');
server.use(bodyparser.urlencoded({extended: false}));
server.engine('mustache', mustache());
server.set('view engine', 'mustache');
server.use(session({
    secret: 'mjkhbki76gvftyjuu66bnA9ou7g',
    resave: true,
    saveUninitialized: false
  }));
server.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});
  // };
server.get('/signup', function(req, res){
    const states = [{value: "AL", state: "AL"}, {value: "AK", state: "AK"},
     {value: "AZ", state: "AZ"},{value: "AR", state: "AR"}, {value: "CA", state: "CA"},
    {value: "CO", state: "CO"}, {value: "CT", state: "CT"}, {value: "DE", state: "DE"},
    {value: "FL", state: "FL"}, {value: "GA", state: "GA"}, {value: "HI", state: "HI"},
    {value: "ID", state: "ID"}, {value: "IL", state: "IL"}, {value: "IN", state: "IN"},
    {value: "CA", state: "CA"}, {value: "CA", state: "CA"}, {value: "CA", state: "CA"},
    {value: "IA", state: "IA"}, {value: "KS", state: "KS"}, {value: "KY", state: "KY"},
    {value: "LA", state: "LA"}, {value: "ME", state: "ME"}, {value: "MD", state: "MD"},
    {value: "MA", state: "MA"}, {value: "MI", state: "MI"}, {value: "MN", state: "MN"},
    {value: "MS", state: "MS"}, {value: "MO", state: "MO"}, {value: "MT", state: "MT"},
    {value: "NE", state: "NE"}, {value: "NV", state: "NV"}, {value: "NH", state: "NH"},
    {value: "NJ", state: "NJ"}, {value: "NM", state: "NM"}, {value: "NY", state: "NY"},
    {value: "NC", state: "NC"}, {value: "ND", state: "ND"}, {value: "OH", state: "OH"},
    {value: "OK", state: "OK"}, {value: "OR", state: "OR"}, {value: "PA", state: "PA"},
    {value: "RI", state: "RI"}, {value: "SC", state: "SC"}, {value: "SD", state: "SD"},
    {value: "TN", state: "TN"}, {value: "TX", state: "TX"}, {value: "UT", state: "UT"},
    {value: "VT", state: "VT"}, {value: "VA", state: "VA"}, {value: "WA", state: "WA"},
    {value: "WV", state: "WV"}, {value: "WI", state: "WI"}, {value: "WY", state: "WY"}];
    res.render('signup', {
      states: states,
    });
});
server.post('/signup', function(req, res){
    User.create({
    username: req.body.username,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    city: req.body.city,
    state: req.body.states,
  })
  .then(function(){
    console.log("The user was added");
  })
  .catch(function(err){
    console.log(err);
  })
    res.render('login');
});

server.get('/login', function (req, res){
    res.render('login');
});

server.post('/login', function(req, res, next) {
if (req.body.username && req.body.password) {
  User.authenticate(req.body.username, req.body.password, function (error, user){
    if (error || !user) {
      let error = new Error('That username or password does not match our records.');
  error.status = 401;
      return error;
    } else {
      req.session.userId = user._id;
      req.session.name = user.first_name;
      // req.session.username = user.username;
      // console.log(req.session.username);
      res.redirect('search');
    }
  });
}else {
  let error = new Error('Username and password are required.');
  // err.status = 401;
  res.render('login');
  return error;

}

});

server.post('/logout', function (req, res) {
  res.render('login', req.session.destroy());
});
server.get('/create', function(req, res){
  res.render('search', {
    username: req.session.username,
    user: req.session.ObjectId,

  });
  console.log(req.session.username, req.session.ObjectId);
  console.log(req.session.username)
})
server.post('/create', function(req, res){

function seperateTags(categories){
  let splitTags = categories.split(","); // split the string at the commas for each tag
  let tagsInput=[]; //create the empty array to store the split strings once they are trimmed
  for (let i=0; i<splitTags.length; i++){ //loops over the split tags ;
    tagsInput.push(splitTags[i].trim());//trims each word to remove the empty spaces.
  }
    return tagsInput;
  };
  console.log(seperateTags(req.body.tags));
  Snippet.create({

    coder: req.body.coder.toLowerCase(), title: req.body.title.toLowerCase(),
    published_date: req.body.published_date, body: req.body.body.toLowerCase(),
    notes: req.body.notes.toLowerCase(), language: req.body.language.toLowerCase(),
    rating: req.body.rating, tags: seperateTags(req.body.tags.toLowerCase()),
    user: req.session.ObjectId, ref: req.session.username,

  })
    .then(function(){
        console.log("The snippet was added");
        // console.log(req.session.ObjectId);
    })
    .catch(function(err){
        //console.log(req.body.coder, req.body.title,req.body.published_date,req.body.body,req.body.language,req.body.notes,req.body.rating,req.body.tags, req.session.username);
        console.log(err)
    });
      res.render('search');
});

server.get('/search', function(req, res, next){
  if (req.session.userId === undefined) {
    res.redirect('login');
    return
  }

 User.findById(req.session.userId)
 .exec(function (error, user) {
   if (error) {
     return res.render('login');
     console.log("I shouldn't be doing this.");
   }else {
     return res.render('search', { name: req.session.name});
   }
 });
});
server.post('/search', function(req, res){
  function snippetFind(type, alter) {
    let updateObject = {};

    updateObject[type] = alter;

  Snippet.find(updateObject)
    .then(function(data){
      res.render('search', {
        name: req.session.name,
        type: alter,
      returnedData: data
      });
    console.log(type, alter);
      console.log(data);
    })
    .catch(function(){
      console.log("The search didn't work!");
    });
  };
  if (req.body.coder !== '' && req.body.language !== '') {
     Snippet.find({ coder: req.body.coder, language: req.body.language })
       .then(function(data){
         res.render('search', {
            returnedData: data
         })
       })
       .catch(function(){
       });
  } if (req.body.tags !== ''){
    snippetFind("tags", req.body.tags);
    }
    if( req.body.coder !== '') {
      snippetFind("coder", req.body.coder);
    } if (req.body.language !== ''){
         snippetFind("language", req.body.language);
      } if( req.body.published_date !== '') {
           snippetFind("published_date", req.body.published_date );
        } if (req.body.title !== ''){
              snippetFind("title", req.body.title);
          }
    });
server.get('/edit', function(req, res){
  res.render('search');
})
server.post('/edit', function(req, res){
  function updateSnippet(field, change){
    let updateObject = {};
    updateObject[field] = change;
    Snippet.findOneAndUpdate({coder: req.body.coder, title: req.body.title}, updateObject,
      {upsert: true, new: true, runValidators: true})
      .then(function(err, doc) {
        if (err){
          console.log(err);
        }
      })
      .catch (function (){
        console.log("This didn't work");
      })
    }
    if (req.body.body !== ""){
      updateSnippet("body", req.body.body);
    } if (req.body.notes !== ""){
      updateSnippet("notes", req.body.notes);
      }
    if (req.body.language !== "") {
      updateSnippet("language", req.body.language);
    }
    if (req.body.tags !== "") {
      updateSnippet("tags", req.body.tags);
    }
    res.render('search', { name: req.session.name});
});
server.get('/delete', function(req, res){
  res.render('search');
});

server.delete('/delete', function(req, res) {
  function deleteSnippet(){
  Snippet.findOneAndRemove({title: req.body.delete_title})
    .then(function(data){
      res.render('search', {
      returnedData: data
      });
      console.log(data);
      console.log("Record Deleted!")
    })
    .catch(function(){
      console.log("Record not Deleted!");
    });

};
if (req.body.delete_title){
  deleteSnippet();
}
  res.render('search', { name: req.session.name});
});
server.listen(3300, function(req, res){
  console.log("The server is running, booyahh");
});
