const mongoos = require('mongoose');
const Schema = mongoose.Schema;

//Define model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
})


// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export model
module.exports = ModelClass;