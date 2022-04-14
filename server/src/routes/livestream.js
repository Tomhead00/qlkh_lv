const express = require('express');
const router = express.Router();
const LiveStreamController = require('../app/controllers/LiveStreamController');
const app = express();

router.get('/getCourse/:_id', LiveStreamController.getCourse);

module.exports = router;
