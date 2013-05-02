
exports.list = function(req, res){
    console.log('filelist');

    var files = [
        {name:'asdf', uploaded:new Date()},
        {name:'asdjfl;ka sd', uploaded:new Date()},
        {name:'askdjf alskjdf', uploaded:new Date()}
    ]

    res.render('filelist', { files: files });
};