const bcrypt = require('bcrypt-nodejs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Define model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
})
 
// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', (next) => {
    // get access to the user model
    const user = this;
    console.log('User: ', user);
    // generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {return next(err)}
        console.log('Salt: ', salt);
        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, (err,hash) => {
            if (err) {return next(err)}
            // Overwrite plain text password with encrypted password
            console.log('Hash', hash);
            console.log('Saving encrypted password')
            user.password = hash;
            console.log(user);
            next();
        })
    })
})


// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;