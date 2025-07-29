const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(403).render("notAuthorised");
    }
};

module.exports = {
    isAuth,
};