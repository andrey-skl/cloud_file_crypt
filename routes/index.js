
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (!req.isAuthenticated()) return res.redirect('/login');

  res.render('index', { title: "Шифрование файлов", username:req.user.name });
};