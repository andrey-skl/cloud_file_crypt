exports.opendb = function(){

    var mongoose = require('mongoose');

    var mongoUri = process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://127.0.0.1:27017';

    //var mongoUri = "mongodb://root:9HA1F370UOh7CVv4JxhB@securespace-huston007-db-0.azva.dotcloud.net:23085";


    var db = mongoose.connect(mongoUri);


    return db;
};