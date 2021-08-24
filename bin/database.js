const mongoose = require('mongoose');
const dbConfig = require('../configs/database');

exports.connectDB = async function() {
    //connect to MongoDB
    var options    = dbConfig.dbOpt;
    var mongodbUri = dbConfig.dbUri
    console.log('Please wait a moment while the database is connecting...')
    await mongoose.connect(mongodbUri, options);
    console.log('MongoDB has been successfully connected!');
};
