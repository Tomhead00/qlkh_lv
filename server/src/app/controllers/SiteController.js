const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SitesController {
    // GET /home
    home(req, res, next) {
        // res.render('home', {
        //     layout: false,
        //     username: req.session.passport,
        // });
        res.send('null');
    }

    failed(req, res) {
        res.send('you are a none valid user');
    }

    profile(req, res) {
        res.send('you are a valid user');
    }
}

module.exports = new SitesController();
