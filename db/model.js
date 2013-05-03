var mongoose = require('mongoose');

/*
mongoose.model('File', {
    properties: ['name', 'fileid', 'uploaded', 'size', 'authoremail', 'responderemail'],

    indexes: [
        'fileid', 'name', 'authoremail', 'responderemail'
    ]
});*/

var Schema   = mongoose.Schema;

var fileschema = new Schema({
    name: String,
    fileid: String,
    uploaded: Date,
    size: Number,
    authoremail: String,
    responderemail: String
});

mongoose.model( 'File', fileschema );

exports.File = function(db) {
    return db.model('File');
};