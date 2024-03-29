module.exports = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();
    }
    return res.redirect('/login'); //automatically sends redirect code (300)
}