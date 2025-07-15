const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(403).send("You are not authorised to access this ressources")
    }
};

module.exports = {
    isAuth,
};