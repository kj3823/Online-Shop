exports.get404Page = (req, res, next) => { // catch all routes
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    res.status(404).render('404', {
        Title: 'Page Not Found',
        path: '/idontknow',
        isAuthenticated: false
    });
}

exports.get500Page = (req, res, next) => { // catch all routes
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'))
    res.status(500).render('500', {
        Title: 'Error',
        path: '/500',
        isAuthenticated: false
    });
}