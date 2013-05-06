exports.opendb = function(){

    var mongoose = require('mongoose');

    var mongoUri = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://127.0.0.1:27017';


    var db = mongoose.connect(mongoUri);


    return db;
};