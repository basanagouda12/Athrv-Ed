const express = require('express');
const path = require('path');
const signup = require('./routes/signup.js'); //Sign up form in here
const login = require('./routes/login');
const Profile = require('./routes/profile');
const admin = require('./routes/admin');
const reports = require('./routes/reports');
const select = require('./routes/select');
const leaves = require('./routes/leaveRoutes/index')
const cors = require('cors');
const app = express();
const project = require('./routes/project');
const calender = require('./routes/Calender/index')
const uploadFile = require('./routes/attendance');
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.json());
//Body Parser used
app.use(
	express.urlencoded({
		extended: 'false'
	})
);
app.use(cors());

//Authorization path
app.use('/profile', Profile);
app.use('/', signup);
app.use('/', login);
app.get('/', function(req, res) {
	res.status(404).send('<h1>Error 404 Resource not found </h1>');
});
app.use('/project', project);
app.use('/admin', admin);
app.use('/reports', reports);
app.use('/', select);
app.use('/leaves',leaves)
app.use('/calender',calender)
app.all('*', function(req, res) {
	res.redirect('/');
});
app.use('/',uploadFile)
//Process port hosted on Heroku
app.listen(process.env.PORT || 5001);
