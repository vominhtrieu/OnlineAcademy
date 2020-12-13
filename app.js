require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//Just place here for app to work
require("./models/LowerLevelCategory");


mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(require("./middlewares/categories"));

app.use('/', require('./routes/home'));
app.use('/', require('./routes/authentication'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
});
