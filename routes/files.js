
var fs = require('fs');
var db = require('./../db/db.js')
var Mongifile = require('./../db/model.js').File(db.opendb());


exports.list = function(req, res){
    console.log('filelist');

    Mongifile.find( function ( err, files, count ){
        console.log(err, files, count)

        //for (var i in files) files[i].remove();

        res.render('filelist', { files: files });
    });

    var files = [
        {name:'asdf', uploaded:new Date(), size:123},
        {name:'asdjfl;ka sd', uploaded:new Date(), size:1233},
        {name:'askdjf alskjdf', uploaded:new Date(), size:1243}
    ]

    //res.render('filelist', { files: files });
};

exports.uploadfile = function(req, res){
    console.log('uploadfile');

    var secret = req.body.secret;

    var file = req.files.files[0];
    file.uploaded = new Date();
    file.authoremail = req.user.email;

    var mongofile = new Mongifile({
        fileid: file.path,
        name : file.name,
        uploaded : new Date(),
        size : file.size,
        authoremail : file.authoremail
    }).save( function( err, _mongofile, count ){
            console.log("saved mongofile:", _mongofile);
        });

    fs.readFile(file.path, function (err, data) {
        console.log('read file', data);
        //TODO: шифрование файла

        res.render('filelist', { files: [file] });
    });

};
