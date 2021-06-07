module.exports = {
    ensureAuthenticated : function(req,res,next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        req.flash('error_msg','Please log in to view the page');
        res.redirect('/')
    },
    forwardAuthenticated:function (req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/user/home-dashboard');
        }
        return next();
    }
};