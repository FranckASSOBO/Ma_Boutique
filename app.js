const mongoose = require('mongoose');
const express = require('express'); // express
// const exphbs = require("express-handlebars");
const Handlebars = require('handlebars');

const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const methodOverride = require('method-override');

const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const passport = require('passport');

// Chargement des routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Implémenter le passport config
require('./config/passport')(passport);

const app = express();
const port = 5000;


// Connexion à la base de donnée mongoDB----------------------
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/TokyoBoutiqueDB', {
    useNewUrlParser: true
})
//Promise
.then(()=> console.log('MongoDB Connected...'))
.catch((err)=> console.log(err));
// -------------------------------------------------------

// ------Express-handlebars middleware-----------
const hbs = expressHandlebars.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        ifeq: function(arg1, arg2, options){
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express body parser middleware
app.use(express.urlencoded({ extended: false}))
app.use(express.json());

// methode overrid middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);
// connect flash middleware
app.use(flash());

// Middleware passeport 
app.use (passport.initialize());
app.use(passport.session());




// Dossier static
app.use(express.static(path.join(__dirname, 'public')));

// Variable global
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null
    next();
});


// Utilisation des routes
app.use('/ideas', ideas)
app.use('/users', users)



//------------------chemin pour les page----------------------

app.get('/', (req, res)=>{
    const title = 'Welcome'
    res.render('index',{
        title: title,
    });
});

app.get('/about', (req, res) =>{
    res.render("about");
});


//--------------------------chemin du port------------------------
app.listen(port, ()=>{
    console.log(`Serveur sur le port ${port}`);
});


