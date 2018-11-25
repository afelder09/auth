const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}
exports.signin = (req, res, next) => {
    console.log('Hello')
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(422).send({ error: "You must provide email and password" })
    }

    User.findOne({ email }, (err, existingUser) => {
        // See  if a user with a given email exists
        if(err) { return next(err)}
        // If a user with email does exists, return an error
        if(existingUser) {
            return res.status(422).send({error: 'Email in use'})
        }
        // If a user with email does not exists, create and save new user record
        const user = new User({
            email,
            password
        })

        user.save( (err) => {
            if(err) {return next(err)}
            res.status(201).send({ token: tokenForUser(user) })
        });
    })
    // Respond to request indicating that the user was created
};