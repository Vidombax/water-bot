const db = require('./db.js');

class Controller {
    static async ping(req, res) {
        res.send('pong');
    }
    static async getUsers(req, res) {
        const users = await db.query('SELECT * FROM users_bot');
        res.json(users.rows);
    }
}

module.exports = Controller;
