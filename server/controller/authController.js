const bcrypt = require('bcryptjs');

var register = async (req, res) => {
    var { username, password, isAdmin } = req.body;
    var db = req.app.get('db');

    var result = await db.get_user(username);
    var existingUser = result[0];

    if(existingUser){
        res
        .status(409)
        .send('Username taken');
    }else{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        var registeredUser = await db.register_user(isAdmin, username, hash);
        var user = registeredUser[0];
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        
        res
        .status(201)
        .send(req.session.user);
    }
    

}

var login = async (req, res) => {
    let { username, password } = req.body;
    var db = req.app.get('db');

    var foundUser = await db.get_user(username);
    if(!foundUser){
        res
        .status(401)
        .send('User not found. Please register as new user before logging in');
    }else{
        var user = foundUser[0];
        let { is_admin, id, username, hash } = user;
        var isAuthenticated = bcrypt.compareSync(password, hash);
        if(!isAuthenticated){
            res
            .status(403)
            .send('Incorrect password');
        }else{
            req.session.user = {
                isAdmin: is_admin,
                id,
                username
            }
            res
            .status(200)
            .send(req.session.user)
        }
    }

}

var logout = async (req, res) => {
    req.session.destroy();
    res
    .sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}