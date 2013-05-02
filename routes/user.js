
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.findOne = function(user, callback){

    if (user.username == '123'){
        callback(null, {name:'123', surname:'321', id:'asdf12312', validPassword:function(pass){
            if (pass=='asd')
                return true;
            return false;
        }} );
    }

}

exports.findOrCreate = function(openIdUser, callback){
    callback(null,
        {
            name:openIdUser.profile.displayName,
            email:openIdUser.profile.emails[0],
            id:openIdUser.openId
        }
    );

}

exports.getGoogleStrategy = function(GoogleStrategy){
    return new GoogleStrategy({
            returnURL: 'http://localhost:3000/auth/google/return',
            realm: 'http://localhost:3000/'
        },
        function(identifier, profile, done) {
            exports.findOrCreate({ openId: identifier, profile: profile }, function(err, user) {
                console.log(user);

                done(err, user);
            });
        }
    )
}