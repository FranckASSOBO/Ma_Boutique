module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Non auttorisé');
        res.redirect('/users/login');
    },
};