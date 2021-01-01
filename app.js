require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const expressSession = require('express-session');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(expressSession);

const bodyParser = require('body-parser');
const User = require('./models/User');

//Just place here for app to work
require('./models/SubCategory');

mongoose.connect(
  process.env.DB_HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log('Failed to connect to database');
      console.log('Process is about to exit');

      process.exit();
    }
  }
);

passport.use(User.createStrategy());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use(flash());
app.use(require('./middlewares/categories'));

app.use('/', require('./routes/studentHome'));
app.use('/', require('./routes/authentication'));
app.use('/', require('./routes/activation'));

app.use('/admin', require('./routes/adminDashboard'));
app.use('/admin/categories', require('./routes/adminCategories'));

app.use('/lecturer', require('./routes/lecturerDashboard'));
app.use('/lecturer/course', require('./routes/lecturerCourse'));
app.use('/about', require('./routes/about'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
