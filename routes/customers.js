const errors = require('restify-errors');
const Customer = require('../models/Customers');


module.exports = server => {
    // To fetch all the customers in the database - GET Customers
    server.get('/customers', async (req, res, next) => {
        // Since we're not doing the standard then catch, to do error handling we follow the below procedure
        try {
            const customers = await Customer.find({});
            res.send(customers);
            next();
        }
        catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // To get a single customer
    server.get('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findById(req.params.id);
            res.send(customer);
            next();
        }
        catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of : ${req.params.id}.`));
        }
    });


    // To Add Customers
    server.post('/customers', async (req, res, next) => {
        // Check for Content-type of JSON
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        // Destructuring all the values
        const { name, email, balance } = req.body;
        // We're adding a customer so we are creating a variable called as 'customer'
        const customer = new Customer({
            // This below syntax doesn't need to be implemented for ES6
            // name: name,
            // email: email,
            // balance: balance
            name, 
            email,
            balance
        });

        // Now we need to save it to the database
        try {
            const newCustomer = await customer.save();
            res.send(201);
            next();
        }
        catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });


    // To Update a Customers Details
    server.put('/customers/:id', async (req, res, next) => {
        // Check for Content-type of JSON
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        // Now we need to save it to the database
        try {
            // The way that this works is that even if we want to update just one Parameter, it will keep rest of data intact and update the name
            const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
            next();
        }
        catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of : ${req.params.id}.`));
        }
    });

    // To Delete a Customer
    server.del('/customers/:id', async (req, res, next) => {
        try {
            const customer = await Customer.findOneAndRemove({ _id: req.params.id });
            res.send(204);
            next();
        }
        catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no Customer with the id of : ${req.params.id}.`));
        }
    });
};

