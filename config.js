module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'https://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://pratyush_agarwal:delta6goingdark@customer-api-p14to.mongodb.net/test?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'secret1'
};