exports.opendb = function(){

    var mongoose = require('mongoose');

    var db = mongoose.connect(this.getMongoUrl());

    return db;
};

exports.getMongoUrl = function(){

    return process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://127.0.0.1:27017';
}