const Course = require('../models/Course');
const LiveStream = require('../models/LiveStream');
const { multipleMongooseToObject } = require('../../util/mongoose');
const uploadLive = require("../middlewares/uploadLive");
const ffmpeg = require('fluent-ffmpeg');


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
    
    async addVideo(req, res, next) {
        await uploadLive(req, res);
        try {
            var proc = new ffmpeg(`./src/public/livestream/${req.body.liveID}`)
                .takeScreenshots({
                    count: 1,
                    timemarks: [ 0 ],
                    filename: `${req.body.liveID.substring(0,req.body.liveID.lastIndexOf("."))}.png`
                    }, `./src/public/img/thumbnail/`, function(err) {
                    console.log('screenshots were saved')
                });
            req.body.image = `/img/thumbnail/${req.body.liveID.substring(0,req.body.liveID.lastIndexOf("."))}.png`;
            const live = new LiveStream(req.body);
            live
                .save()
                .then(
                    (live) => {
                        Course.findByIdAndUpdate(
                            req.params._id,
                            { $addToSet: { livestreams: live._id } },
                            { new: true, useFindAndModify: false },
                        ).then()
                        res.send(true)
                    }
                )
                .catch(next => {
                    res.send(false)
                });
        } catch (err) {
            console.log(err);
            res.send(false)
        }
    }

    //  post '/:_id/:liveID/deleteLive'
    async deleteLive(req, res, next) {
        try {
            Course.updateOne(
                { _id: req.params._id },
                { $pull: { livestreams: req.params.liveID } },
                { new: true, useFindAndModify: false },
            ).catch(next);
    
            LiveStream.findByIdAndDelete({ _id: req.params.liveID })
                .then((live) => {
                    var filePath = `src/public/livestream/${live.liveID}`;
                    var thumbnailPath = `src/public/img/thumbnail/${live.liveID.substring(0,live.liveID.lastIndexOf("."))}.png`;
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(thumbnailPath);
                    res.send(true)
                })
                .catch(next => {
                    res.send(false)
                });
        } catch (err) {
            res.send(false)
        }
    }
}

module.exports = new LiveStreamController();
