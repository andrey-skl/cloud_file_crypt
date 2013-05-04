
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (!req.isAuthenticated()) return res.redirect('/login');

  res.render('index', { title: "Secure space", username:req.user.name, useremail: req.user.email });
};