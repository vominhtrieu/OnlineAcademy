require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

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
    console.log('Connected to database');
  }
);

passport.use(User.createStrategy());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({ email: profile.emails[0].value });
        if (currentUser) {
          done(null, currentUser);
        } else {
          const newUser = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            active: true,
            role: 'student',
          });
          done(null, newUser);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/auth/facebook/redirect',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const currentUser = await User.findOne({ facebookId: profile.id });
        if (currentUser) {
          done(null, currentUser);
        } else {
          const newUser = await User.create({
            fullName: profile.displayName,
            facebookId: profile.id,
            active: true,
            role: 'student',
          });
          done(null, newUser);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

app.use('/images', express.static('images'));
app.use('/videos', express.static('videos'));
app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(flash());
app.use(require('./middlewares/categories'));

app.use('/', require('./routes/studentHome'));
app.use('/', require('./routes/studentInfomation'));
app.use('/search', require('./routes/search'));
app.use('/', require('./routes/authentication'));
app.use('/', require('./routes/activation'));
app.use('/profile', require('./routes/profile'));
app.use('/categories', require('./routes/categories'));

app.use('/courses', require('./routes/studentCourse'));
app.use('/courses', require('./routes/studentReview'));

app.use('/admin', require('./routes/adminDashboard'));
app.use('/admin/categories', require('./routes/adminCategories'));
app.use('/admin/students', require('./routes/adminStudent'));
app.use('/admin/lecturer', require('./routes/adminLecturer'));
app.use('/admin/courses', require('./routes/adminCourse'));

app.use('/lecturer', require('./routes/lecturerDashboard'));
app.use('/lecturer/course', require('./routes/lecturerCourse'));
app.use('/about', require('./routes/about'));
app.use('/avatar', require('./routes/userAvatar'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
