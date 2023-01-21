const mongoose =   require('mongoose');
const express = require('express');
const {ensureAuthenticated } = require("../helpers/auth")

const router = express.Router();


// Chargement du model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

// route du formulaire
router.get('/add',ensureAuthenticated, (req, res)=>{
    res.render("ideas/add")
});
// Récupération des données et les afficher 'views/ideas/boutique'
router.get('/', ensureAuthenticated, (req, res)=>{
    Idea.find({user: req.user.id})
    .sort({date: "desc" })
    .then((ideas) => {
        res.render('ideas/index', {
            ideas: ideas,

        });
    });
});
//accès à touts les idéas

router.get('/allideas', ensureAuthenticated, (req, res)=>{
    Idea.find({})
    .sort({date: "desc" })
    .then((ideas) => {
        res.render('ideas/allideas', {
            ideas: ideas,
            user: req.user
        });
    });
});



// Traitement du formulaire
router.post('/', ensureAuthenticated, (req, res)=>{
    console.log(req.body);
    // res.send('valider')



    // Validation des informations du formulaire
    let errors = [];

    if(!req.body.title){
        errors.push({text: "Please add a title"})
    }
    if(!req.body.price){
        errors.push({number: "Please add a price"})
    }
    if(!req.body.cut){
        errors.push({text: "Please add a cut"})
    }
    if(!req.body.description){
        errors.push({text: "Please add descriptions"})
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            price: req.body.price,
            cut: req.body.cut,
            description: req.body.description
        })
    } else{
        //res.send('passé')
        const newUser = {
            title: req.body.title,
            price: req.body.price,
            cut: req.body.cut,
            description: req.body.description,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea =>{
                req.flash('success_msg', "L'article a été ajouté")
                res.redirect('/ideas')
        });
    }
});


    // Modification  et suppression du formulaire
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then((idea) =>{
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Non Autorisé');
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit', {
                idea: idea,
            });
        }
    });
});

router.put('/:id', ensureAuthenticated, (req, res)=> {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{

        // nouvelles valeurs
        idea.title = req.body.title;
        idea.price = req.body.price;
        idea.cut = req.body.cut;
        idea.description = req.body.description;

        idea.save()
                .then(idea =>{
                    req.flash("success_msg", "L'article a été modifié")
                    res.redirect('/ideas');
                });
    });
});



// Suppression de données
router.delete('/:id', ensureAuthenticated, (req, res)=> {
    Idea.remove({ _id: req.params.id})
        .then(()=>{
            req.flash('success_msg', "L'article a été supprimé")
            res.redirect("/ideas")
        });
    });

    module.exports = router;
