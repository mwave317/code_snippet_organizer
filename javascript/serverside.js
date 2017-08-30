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
    resave: false,
    saveUninitialized: true
  }));
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
    reenterPassword: req.body.reenterPassword,
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

server.post('/login', function(req, res) {
  //Check out .populate
  let username = null;
    if (req.body.username === username && req.body.password === password) {
      console.log('Wrong username or password');
      res.render('login');
    }
  else if (username !== null) {
    req.session.username = username;
    res.redirect('/search');
  }
  req.session.username = req.body.username;
    User.findOne({username: req.body.username})
      .then(function(data){
        req.session.ObjectId = data._id;
        console.log(data._id);
        res.render('search', { // save the uername and id and cannot be done in the rendor
        username: req.session.username,
        user: req.session.ObjectId, //don't forget to pass the object id and username in the session
        })
      });
});
server.get('/create', function(req, res){
  res.render('search', {
    username: req.session.username,
    user: req.session.ObjectId,

  });
  console.log(req.session.username, req.session.ObjectId);
})
server.post('/create', function(req, res){
  Snippet.create({
    coder: req.body.coder, title: req.body.title.toUpperCase(),
    published_date: req.body.published_date, body: req.body.body,
    notes: req.body.notes, language: req.body.language,
    rating: req.body.rating, tags: req.body.tags,
    user: req.session.ObjectId, ref: req.session.username,

  })
    .then(function(){
        console.log("The snippet was added");
        console.log(req.session.ObjectId);
    })
    .catch(function(){
        //console.log(req.body.coder, req.body.title,req.body.published_date,req.body.body,req.body.language,req.body.notes,req.body.rating,req.body.tags, req.session.username);
        console.log("The snippet wasn't added")
    });
      res.render('search');
});

server.get('/search', function(req, res){

    res.render('search');
});

server.post('/search', function(req, res){
  if (req.body.coder !== '' && req.body.language !== '') {
     Snippet.find({ coder: req.body.coder, language: req.body.language })
       .then(function(data){
         res.render('search', {
            returnedData: data
         })
       })
       .catch(function(){
       });
   } else if (req.body.tags !== ''){
      Snippet.find({tags: req.body.tags})
        .then(function(data){
          res.render('search', {
          returnedData: data
          });
        console.log(req.body.tags);
          console.log(data);
        })
        .catch(function(){
          console.log("The search didn't work!");
        });
    } else if( req.body.coder !== '') {
      console.log('this is a test');
        Snippet.find({coder: req.body.coder})
          .then(function(data){
            res.render('search', {
            returnedData: data
            });
            console.log("I should be printing" + req.body.coder);
            // console.log(data);
          })
          .catch(function(){
            console.log("The search didn't work!");
          });
       } else if (req.body.language !== ''){
          Snippet.find({tags: req.body.language})
            .then(function(data){
              res.render('search', {
              returnedData: data
              });
                console.log(req.body.language);
                // console.log(data);
            })
            .catch(function(){
              console.log("The language search didn't work!");
            });
         } else if( req.body.published_date !== '') {
            Snippet.find({coder: req.body.published_date})
              .then(function(data){
                res.render('search', {
                returnedData: data
                });
                  console.log(req.body.published_date);
                  // console.log(data);
              })
              .catch(function(){
                console.log("The search didn't work!");
              });
            } else if (req.body.title !== ''){
                Snippet.find({tags: req.body.title})
                  .then(function(data){
                    res.render('search', {
                    returnedData: data
                    });
                      console.log(req.body.title);
                      // console.log(data);
                  })
                  .catch(function(){
                    console.log("The language search didn't work!");
                  });
            } else if (req.body.title !== ''){
                Snippet.find({tags: req.body.title})
                  .then(function(data){
                    res.render('search', {
                    returnedData: data
                    });
                      console.log(req.body.title);
                      // console.log(data);
                  })
                  .catch(function(){
                    console.log("The language search didn't work!");
                  });
              };
    });
server.get('/edit', function(req, res){
  res.render('search');
})
server.post('/edit', function(req, res){
  res.render('search', function (){
    Snippet.edit({
      title: req.body.title, body: req.body.body,
      language: req.body.language, tags: req.body.tags
    })
  });
})

server.get('/snippet', function(req, res){
  res.render('search');
})

server.listen(3300, function(req, res){
  console.log("The server is running, booyahh");
});
