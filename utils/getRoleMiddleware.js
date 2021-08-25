async function getRoleMiddleware(req, res, next) {
    // on vérifie si un token est renseigné
    if (!req.body.token) {
        req.role = "unauthenticated";
        return next();
    }

    // On cherche le token de l'utilisateur
    const User = req.app.get("models").User;
    const toCheckUser = await User.findOne({token: req.body.token})

    // on retourne unauthenticated si pas de user
    if (!toCheckUser) {
        req.role = "unauthenticated";
        return next();
    }

    req.role = toCheckUser.role;
    return next();
}

module.exports = getRoleMiddleware;