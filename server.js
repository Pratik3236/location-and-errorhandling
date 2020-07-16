const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const cors = require('cors');

const app = express();
const db = require('./database/database')
const globalErrorHandler = require('./utils/errorController');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// requireing routes
const studentRoutes = require('./routes/students/studentRouter');
const otpRoutes = require('./routes/otp/otpRouter');
const locationRoutes = require('./routes/location/locationRouter')
const entity = require('./routes/entity/entityRouter')
const categorylevel = require('./routes/categorylevel/categorylevelRouter')
const courses = require('./routes/courses/courseRouter')

// setting up body-parser 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(cors());

// routes goes here
app.use('/student', studentRoutes);
app.use('/otp', otpRoutes);
app.use('/location', locationRoutes)
app.use('/entity', entity)
app.use('/categorylevel', categorylevel)
app.use('/courses', courses)

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: false,
    message: 'Requested API not found',
  });
});

// checking connection to database
const dbConnection = async () => {
    try {
        await db.authenticate();
        console.log('mysql db connection has been successfully established.')
      } catch (error) {
        console.error('Unable to connect to the mysql database:', error);
    }   
};

dbConnection();
app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
    console.log('masterG server is running.....');
  });