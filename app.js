const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require ('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// Passport Config
require('./config/passport')(passport);


//DB CONFIG
const db = require('./config/keys').mongoURI;

//CONNECT TO MONGO
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
//STATIC FILES
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public.css'))
app.use('/images', express.static(__dirname + 'public/images'))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Body parser

app.use(express.urlencoded({extended: false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));