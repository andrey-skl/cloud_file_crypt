
var fs = require('fs');
var db = require('./../db/db.js')
var Mongofile = require('./../db/model.js').File(db.opendb());
var crypto = require('crypto');


exports.list = function(req, res){

    Mongofile.find( function ( err, files, count ){
        //console.log(err, files, count)

        //проверка и удаление из базы записей о отсутствующих файлах
        /*for (var i in files){
            fs.exists(files[i].fileid, function(exists) {
                console.log("removing not existed file ", files[i])
                if (!exists) files[i].remove(function ( err, todo ){
                    if (err) console.log("error removeing file", err);
                });
            });
        }*/

        //for (var i in files) files[i].remove();

        res.render('filelist', { files: files });
    });

};

//скачивание файла
exports.downloadfile = function(req, res){
    if (!req.isAuthenticated()) return res.redirect('/login');

    var fileid = req.query.fileid;
    var secret = req.query.secret;

    Mongofile.find({'fileid':fileid}, function ( err, files, count ){
        console.log(files[0]);

        var filePath = files[0].fileid;

        fs.readFile(filePath, function (err, data) {
            if (err) {
                throw err;
            }

            try{
                var decrypted = decryptByAES256(data , secret);
                console.log('decrypt file', decrypted);
                res.setHeader('Content-Disposition', 'attachment; filename='+files[0].name);
                res.setHeader('Content-Length', decrypted.size);

                res.send(decrypted);
            } catch(e) {
                console.log('cant decrypt file with key', filePath, secret);
                res.redirect('/');
            }

        });

    });
}

exports.issecretok = function(req,res){
    if (!req.isAuthenticated()) return res.redirect('/login');

    var fileid = req.query.fileid;
    var secret = req.query.secret;
    Mongofile.find({'fileid':fileid}, function ( err, files, count ){

        var filePath = files[0].fileid;

        fs.readFile(filePath, function (err, data) {
            if (err) {
                throw err;
            }
            try{
                var decrypted = decryptByAES256(data , secret);
                console.log('decrypt file', decrypted);
                res.send("ok");
            } catch(e) {
                console.log('cant decrypt file with key', filePath, secret);
                res.send("notok");
            }

        });

    });
}

exports.removefile = function(req, res){
    var fileid = req.query.fileid;
    console.log("removing file with id", fileid);

    Mongofile.find({'fileid':fileid}, function ( err, files, count ){

        console.log("removing file", files[0]);

        var filePath = files[0].fileid;

        files[0].remove();
        fs.unlinkSync(filePath);

        res.end("ok");

    });
}

exports.uploadfile = function(req, res){
    console.log('uploadfile');

    var secret = req.body.secret;

    var file = req.files.files[0];
    file.uploaded = new Date();
    file.authoremail = req.user.email;
    file.fileid = file.path;

    var mongofile = new Mongofile({
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

        var crypted = cryptByAES256(data, secret);

        fs.writeFileSync(file.path, crypted)

        console.log('file crypted', crypted);

        res.render('filelist', { files: [file] });
    });

};

exports.sendfile = function(req, res){
    var fileid = req.body.fileid;
    var email = req.body.email;

    Mongofile.find({'fileid':fileid}, function ( err, files, count ){

        console.log("sending file", files[0]);

        files[0].responderemail = email;
        files[0].save();

        res.render('filelist', { files: files });

    });
}

function cryptByAES256(data, secret){

    var cipher = crypto.createCipher('aes256', secret);

    var cryptedData = cipher.update(data, input_encoding='binary', output_encoding='binary')

    cryptedData += cipher.final(output_encoding='binary');

    return new Buffer(cryptedData, 'binary');
}

function decryptByAES256(data, secret){

    var decipher = crypto.createDecipher('aes256', secret);

    var decryptedData =decipher.update(data, input_encoding='binary', output_encoding='binary')

    decryptedData += decipher.final(output_encoding='binary');

    return new Buffer(decryptedData, 'binary');;
}
