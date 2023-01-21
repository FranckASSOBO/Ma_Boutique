const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Chargement du model utilisateur
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: "email"},(email, password, done)=>{
    //console.log(email)



    //correspondant de l'utilisateur
    User.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null, false, {message:'Utilisateur non trouvé'})
                }
                // Correspondance ou pas du mot du password
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, {message: 'Le mot de passe ne correspond pas'});
                    }
                });
            });
        })
    );
    passport.serializeUser(function(user, done){
        done(null, user.id)
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user)
        })
    })
};