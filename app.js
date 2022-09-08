const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware - use static files
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// ejs view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://MkDay:kpWco2a4eSmv4VIC@cluster0.imtvyn9.mongodb.net/node-auth-tutorial';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, /* useCreateIndex: true */ })

    .then(result => {
        console.log('connected to database');
        app.listen(3000);
    })
    .catch(err => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/smoothies', requireAuth, (req, res) => {
    res.render('smoothies');
});

app.use(authRoutes);

// cookies

// app.get('/set-cookies', (req, res) => {

//     //res.setHeader('Set-Cookie', 'newUser=true');

//     res.cookie('newUser', false);
//     res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true });

//     res.send('you got the cookie!');

    
// });

// app.get('/read-cookies', (req, res) => {

//     const cookies = req.cookies;
//     console.log(cookies);
 
//     res.json(cookies); // cookies send out to the browser as js object as a response  
// });

