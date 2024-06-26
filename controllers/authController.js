const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors

const handleErrors = (err) => {
    console.log(err.message, err.code);

    let errors = { email: '', password: ''};

    if(err.message === 'incorrect email') {
        errors.email = 'that email is not registered!';
    }

    if(err.message === 'incorrect password') {
        errors.password = 'That password is incorrect!';
    }

    // handle duplicate emails

    if( err.code === 11000 ) {
        errors.email = 'That email is already registered'

        return errors;
    }
    // validate errors

    if(err.message.includes('user validation failed')) {
        //console.log(err);
        //console.log(Object.values(err.errors));
        
        Object.values(err.errors).forEach(({ properties }) => {
             //console.log(properties.path);
             //console.log(properties.message);
            errors[properties.path] = properties.message;
        });    
    }
    return errors;
};


// create json web token

let maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'jwt net ninja', {
        expiresIn: maxAge
    });
};



const signup_get = (req, res) => {
    res.render('signup');
};

const login_get = (req, res) => {
    res.render('login');
};

const signup_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {

        const user = await User.create({ email, password });

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        
        res.status(201).json({ user: user._id });

    } catch(err) {
        //console.log(err);
        const error = handleErrors(err);
        //res.status(400).send('User not created');
        res.status(400).json({ error });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;
    
   // get entered values and check them against the values stored at db

   try {

        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        
        res.status(200).json({ user: user._id });

   } catch(err) {
        //console.log(err);
        const error = handleErrors(err);
        res.status(400).json({ error });
   }

    //console.log(email, password);
    //res.send('new login');
};

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
};