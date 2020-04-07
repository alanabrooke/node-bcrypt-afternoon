var usersOnly = (req, res, next) => {
    if(!req.session.user){
        res
        .status(401)
        .send('Please log in')
    }
    next();
}

var adminsOnly = (req, res, next) => {
    let {isAdmin} = req.session.user;
    if(!isAdmin){
        res
        .status(403)
        .send('You are not an admin')
    }
    next();
}

module.exports = {
    usersOnly,
    adminsOnly
}