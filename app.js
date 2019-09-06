const express = require('express');
const path = require('path');
const app = express();
const db = require('./database/db.js'); 
const userRoute = require('./controllers/userController/userRouter.js');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
db();

app.use( expressSession ( {
    key: 'NHMARKET_SID',
    secret: 'f={/jBwJ:#.euKSyxFb9eF{mwQaYR6',
	saveUninitialized: true,
	resave: false,
	cookie: {expire: new Date(Date.now+60*60), singed: true} 
}));

app.use(express.static('/productPhoto/'));
	
app.use('/user', userRoute);

app.listen(80, () => {
  console.log('Express App on port 80!');
});