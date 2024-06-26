const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [6, 'Please enter a password with 6 minimum charactors']
    }
});

// fire a function after saving the doc into db

userSchema.post('save', function(doc, next) {
    //console.log('new user was created and saved', doc);
    next();
});

// fire a function before saving doc into db
userSchema.pre('save', async function(next) {
    //console.log('new user is about to created and saved', this);

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email: email });

    if(user) {
        const auth = await bcrypt.compare(password, user.password);

        if(auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;