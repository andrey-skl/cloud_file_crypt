
var fs = require('fs');
var db = require('./../db/db.js')
var Mongifile = require('./../db/model.js').File(db.opendb());


exports.list = function(req, res){
    Mongifile.find( function ( err, files, count ){
        //console.log(err, files, count)

        //проверка и удаление из базы записей о отсутствующих файлах
        for (var i in files){
            fs.exists(files[i].fileid, function(exists) {
                console.log("removing not existed file ", files[i])
                if (!exists) files[i].remove(function ( err, todo ){
                    if (err) console.log("error removeing file", err);
                });
            });
        }

        //for (var i in files) files[i].remove();

        res.render('filelist', { files: files });
    });

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

        res.render('fileinlist',  file );
    });

};
