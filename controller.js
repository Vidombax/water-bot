class Controller {
    static async ping(req, res) {
        res.send('pong');
    }
}

module.exports = Controller;