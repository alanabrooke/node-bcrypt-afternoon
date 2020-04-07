var dragonTreasure = async (req, res) => {
    var db = req.app.get('db');

    var treasure = await db.get_dragon_treasure(1);

    res
    .status(200)
    .send(treasure);

}

var getUserTreasure = async (req, res) => {
    var db = req.app.get('db');
    let { user } = req.session;
    var treasure = await db.get_user_treasure( user.id );

    res
    .status(200)
    .send(treasure);
}

var addUserTreasure = async (req, res) => {
    let { treasureURL } = req.body;
    let { id } = req.session.user;
    var db = req.app.get('db');

    var userTreasure = await db.add_user_treasure(treasureURL, id);

    res
    .status(200)
    .send(userTreasure);
}

var getAllTreasure = async (req, res) => {
    var db = req.app.get('db');

    var treasure = await db.get_all_treasure();

    res
    .status(200)
    .send(treasure);
}

module.exports = {
    dragonTreasure,
    getUserTreasure,
    addUserTreasure,
    getAllTreasure
}