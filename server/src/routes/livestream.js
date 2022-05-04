const express = require('express');
const router = express.Router();
const LiveStreamController = require('../app/controllers/LiveStreamController');
const app = express();

router.get('/getCourse/:_id', LiveStreamController.getCourse);
router.post('/:_id/addVideo', LiveStreamController.addVideo);
router.post('/:_id/:liveID/deleteLive', LiveStreamController.deleteLive);

module.exports = router;
