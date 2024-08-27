const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const authorization = require('../middlewares/authorization')
const swagger = require('../middlewares/swagger')


router.post('/login', swagger.login, authorization.doAuth, controller.user.login);

module.exports = router;
