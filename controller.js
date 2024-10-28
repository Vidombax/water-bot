class Controller {
    async ping(req, res) {
        await res.send('pong');
    }
}

export default new Controller();