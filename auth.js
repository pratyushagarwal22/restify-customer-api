const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// The previous technique that was used will give an error saying that it was already brought in, so this new method is used
const User = mongoose.model('User');

exports.authenticate = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Getting a user by email
            const user = await User.findOne({email});

            // To match the password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                    // Password Matched
                    resolve(user);
                }
                else {
                    // Password didn't Match
                    reject('Authentication Failed');
                }
            });  
        } catch(err) {
            // Email not found
            reject('Authentication Failed');
        }
    });
};