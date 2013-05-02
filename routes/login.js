
/*
 * GET home page.
 */

exports.login = function(req, res){
    res.render('login', { title: 'Пожалуйста, авторизуйтесь' });
};

exports.loginpost = function(req, res){
    res.render('login', { title: 'Спасибо за авторизацию' });
};