const mongoose = require('mongoose');
const express = require('express'); 
const bcrypt = require('bcryptjs');
//Authentification
const passport = require('passport');


const router = express.Router();


// Chargement du model--------
require('../models/Users');
const User = mongoose.model("users");


//User login route
router.get('/login', (req, res, )=>{
    res.render('users/login')
});

// Enregistrement
router.get('/register', (req, res)=>{
    res.render('users/register')
});

//Login formulaire POST
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Register formulaire

router.post('/register', (req, res)=>{
    // //Pour tester
    // console.log(req.body)
    // res.send('enregistré')

    let errors = [];

    if(req.body.password !== req.body.password2){
        errors.push({text: 'le mot de doit être le même'})

    }
    if(req.body.password.length < 4){
        errors.push({text: 'le mot de passe doit contenir au moins 4 caractères',
    });
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    }else{
// Securité de connexion
        User.findOne({ email: req.body.email})
            .then(user => {
                if(user){
                    req.flash('errors_msg', 'Email déjà enregistré');
                    res.redirect('/users/register')
                }else{
                    const newUser = new User ({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })
                
                // res.send('enregistrement passé')
                // console.log(newUser)
            
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Vous êtes à présent enregistré et vous pouvez vous connecté');
                                    res.redirect('/users/login');
                                })
                                .catch(err =>{
                                    console.log(err);
                                    return;
                            });
                        });
                    });
                }
            });
            
        } 
    });
    // Route du logout utilisateur
    router.get('/logout', (req, res)=>{
        req.logout(function(err) {
            if(err){ return next(err);}
            req.flash('success_msg', 'Vous êtes à présent déconnecté')
            res.redirect('/users/login')
        });
        //req.logout()
        // req.flash('success_msg', 'Vous êtes à présent déconnecté')
        // res.redirect('/users/login')
    });

module.exports = router;