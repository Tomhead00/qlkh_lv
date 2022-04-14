const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class LiveStreamController {
    // GET /getCourse/:_id
    getCourse(req, res, next) {
        // console.log(req.params._id);
        Course.findById(req.params._id)
        .then(course => {
            res.send(course)
        })
        .catch(next)
    }
}

module.exports = new LiveStreamController();
