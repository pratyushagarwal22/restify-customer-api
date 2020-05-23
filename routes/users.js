const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = server => {
    // Register a User
    server.post('/register', (req, res, next) => {
        const { email, password } = req.body;

        const user = new User({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, async (err, hash) => {
                // HAshing the password
                user.password = hash;
                // Saving the User
                try {
                    const newUser = await user.save();
                    res.send(201);
                    next();
                } catch(err) {
                    return next(new errors.InternalError(err.message));
                }
            });
        });
    });

    // Authenticate User Route
    server.post('/auth', async (req, res, next) => {
        // Getting the email and password first
        const { email, password } = req.body;

        try {
            // Authenticating the User
            // await needs to be used as we are using async
            const user = await auth.authenticate(email, password);
            
            // Creating the token value
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });

            // To respond with the token
            const { iat, exp } = jwt.decode(token);
            res.send({ iat, exp, token });

            next();
        } catch(err) {
            // User Unauthorized
            return next(new errors.UnauthorizedError(err));
        }
    });
};

























