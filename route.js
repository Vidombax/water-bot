import {Router} from 'express';
import Controller from "./controller.js";

const router = new Router();

router.get('/ping', Controller.ping);

export default router;