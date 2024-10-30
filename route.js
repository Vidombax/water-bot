const { Router } = require('express');
const Controller = require("./controller.js");

const router = new Router();

router.get('/ping', Controller.ping);
router.get('/users', Controller.getUsers);

module.exports = router;
