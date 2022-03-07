const Course = require('../models/Course');
const Video = require('../models/Video');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const { populate } = require('../models/Video');
const { course } = require('./CourseController');

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}

async function calculatorTimeCourse(id)  {
    let time = 0;
    await Course.findById(id)
        .then(async (course) => {
            // console.log(course.video);
            await Video.find({
                '_id': { $in: course.video}})
                .then(video2 => {
                    for(video of video2) {
                        // console.log(video.time)
                        time += video.time
                    }
                })
        })
    // console.log("tottla:" + time);
    Course.findByIdAndUpdate(id, {time: time}).then()
}

class MeController {
    // GET /me/stored/Courses
    storeCourses(req, res, next) {
        try {
            let courseQuery = Course.find({
                actor: req.session.passport.user._id,
            });
    
            if (req.query.hasOwnProperty('_sort')) {
                courseQuery = courseQuery.sort({
                    [req.query.column]: req.query.type,
                });
            }
            Promise.all([courseQuery]).then(
                (courses) =>
                    res.send(courses),
            );
        } catch (err) {}
    }

    // GET /me/stored/deletedCount
    deletedCount(req, res, next) {
        try {
            Course.countDocumentsDeleted({
                actor: req.session.passport.user._id,
            })
            .then(deletedCount => {
                res.send(deletedCount.toString())
            })
            .catch(next)
        } catch(err){}
    }

    

    // GET /me/trash/Courses
    trashCourses(req, res, next) {
        try {
            let courseQuery = Course.findDeleted({
                actor: req.session.passport.user._id,
            });
    
            if (req.query.hasOwnProperty('_sort')) {
                courseQuery = courseQuery.sort({
                    [req.query.column]: req.query.type,
                });
            }
            Promise.all([courseQuery]).then(
                (courses) =>
                    res.send(courses),
            );
        } catch (err) {}
    }

    // GET /me/stored/:id/editCourse
    async edit(req, res, next) {
        try {
            const course = await Course.findById(req.params.id)
            .populate('video')
            .populate({ modal: 'user', path: 'actor' })
            if  (
                    req.session.passport.user.email == course.actor.email ||
                    req.session.passport.user.role == 'admin'
                )
                res.send(course)
            else res.send(false)  
        } catch(err) {
            res.send(false)
        }
    }
    // GET /me/stored/:id/editCourse/countDeleteVideo
    async countDeleteVideo(req, res, next) {
        try {
            const course = await Course.findById(req.params.id)
            .populate({ modal: 'user', path: 'actor' })
            if  (
                    req.session.passport.user.email == course.actor.email ||
                    req.session.passport.user.role == 'admin'
                ) {
                    Video.countDocumentsDeleted({_id: course.video})
                    .then((num) => {
                        res.send(num.toString())
                    })
                }
            else {
                res.send(false) 
            } 
        } catch(err) {
            res.send(false)
        }
    }
        
    // // GET /me/stored/:id/edit/addVideo
    // addVideo(req, res, next) {
    //     Course.findById(req.params.id)
    //         .then((course) =>
    //             res.render('me/editVideo', {
    //                 title: 'Thêm video cho khóa học',
    //                 username: req.session.passport,
    //                 course: mongooseToObject(course),
    //             }),
    //         )
    //         .catch(next);
    // }

    // POST /me/stored/:id/edit/:_id/:action
    actionVideo(req, res, next) {
        // res.json(req.params);
        try {
            switch (req.params.action) {
                case 'preview':
                    Course.findById({ _id: req.params.id })
                        .then((course) => {
                            var arr = course.video;
                            var pos = arr.indexOf(req.params._id);
                            var pos1 = pos - 1;
                            if (pos == 0) {
                                pos1 = arr.length - 1;
                            }
                            arr = array_move(arr, pos, pos1);
                            // console.log(arr, pos, pos1);
                            Course.findOneAndUpdate(
                                { _id: req.params.id },
                                { $pullAll: { video: arr } },
                            );
                            Course.findOneAndUpdate(
                                { _id: req.params.id },
                                { video: arr },
                            )
                                .then(() => {
                                    res.send(true);
                                })
                                .catch(next);
                        })
                        .catch(next);
                    break;
                case 'delete':
                    Video.delete({ _id: req.params._id })
                        .then(() => {
                            res.send(true);
                        })
                        .catch(next);
                    calculatorTimeCourse(req.params.id)
                    break;
                case 'next':
                    Course.findById({ _id: req.params.id })
                        .then((course) => {
                            var arr = course.video;
                            var pos = arr.indexOf(req.params._id);
                            var pos1 = pos + 1;
                            if (pos == arr.length - 1) {
                                pos1 = 0;
                            }
                            arr = array_move(arr, pos, pos1);
                            // console.log(arr, pos, pos1);
                            Course.findOneAndUpdate(
                                { _id: req.params.id },
                                { $pullAll: { video: arr } },
                            );
                            Course.findOneAndUpdate(
                                { _id: req.params.id },
                                { video: arr },
                            )
                                .then(() => {
                                    res.send(true);
                                })
                                .catch(next);
                        })
                        .catch(next);
                    break;
                default:
                    res.send(false);
            }
        } catch(err) {
            res.send(false)
        }
    }

    // // GET /me/stored/:id/edit/:_id/update
    // async updateVideo(req, res, next) {
    //     const course = await Course.findById(req.params.id);
    //     Video.findById(req.params._id)
    //         .then((video) =>
    //             res.render('me/updateVideo', {
    //                 title: 'Cập nhật video khóa học',
    //                 username: req.session.passport,
    //                 video: mongooseToObject(video),
    //                 course: mongooseToObject(course),
    //             }),
    //         )
    //         .catch(next);
    // }

    // GET /me/trash/:id
    showTrashVideo(req, res, next) {
        Course.findById(req.params.id)
            .populate({ modal: 'user', path: 'actor' })
            .then((course) => {
                try {
                    if (
                        req.session.passport.user.email == course.actor.email ||
                        req.session.passport.user.role == 'admin'
                    ) {
                        let videoQuery = Video.findDeleted({
                            _id: course.video,
                        });

                        if (req.query.hasOwnProperty('_sort')) {
                            videoQuery = videoQuery.sort({
                                [req.query.column]: req.query.type,
                            });
                        }
                        Promise.all([videoQuery]).then(
                            (video) =>
                                res.send(video),
                        );

                    } else {
                        return res.send(false);
                    }
                } catch (next) {
                    return res.send(false);
                }
            })
            .catch(next => {
                res.send(false)
            });
    }

    // PUT /me/stored/:id/edit/:_id/update
    putUpdateVideo(req, res, next) {
        // console.log(req.body.video, typeof(req.body.video))
        Video.findByIdAndUpdate({_id: req.params._id}, {
            name: req.body.video.name,
            description: req.body.video.description,
            videoID: req.body.video.videoID,
            time: req.body.time,
            image:
                'https://img.youtube.com/vi/' +
                req.body.video.videoID +
                '/sddefault.jpg',
        })
        .then(video => {
            // console.log(video);
            res.send(true);
        })
        .catch(next);
        calculatorTimeCourse(req.params.id)
    }

    // PUT /me/stored/:id
    async storeVideo(req, res, next) {
        // res.json(req.body)
        try {
            const course = await Course.findByIdAndUpdate({ _id: req.params.id }, {$inc: {time: +req.body.time}});
            // console.log(typeof(course._id))
            req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
            const video = new Video(req.body);
            video
                .save()
                .then(
                    (video) =>
                        Course.findByIdAndUpdate(
                            req.params.id,
                            { $addToSet: { video: video._id } },
                            { new: true, useFindAndModify: false },
                        ),
                    // console.log(video),
                    res.send(true),
                )
                .catch(next => {
                    res,send(false)
                });
        } catch {
            res.send(false)
        }
    }

    // PATCH /me/trash/:_id/restore/:id
    restoreVideo(req, res, next) {
        Video.restore({ _id: req.params.id })
            .then(video =>{
                // console.log(video);
                res.send(true)
            })
            .catch(next);
        calculatorTimeCourse(req.params._id)
    }

    // DELETE /me/trash/:_id/delete/:id/force
    forceDeleteVideo(req, res, next) {
        // res.json(req.params)
        Course.updateOne(
            { _id: req.params._id },
            { $pull: { video: req.params.id } },
            { new: true, useFindAndModify: false },
        ).catch(next);

        Video.deleteOne({ _id: req.params.id })
            .then(() => res.send(true))
            .catch(next);
    }

    // POST /me/trash/:_id/handle-form-actions-trash
    handleFormTrashVideoActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                for (const _id of req.body.videoIDs) {
                    Course.updateMany(
                        { _id: req.params._id },
                        { $pull: { video: _id } },
                        { new: true, useFindAndModify: false },
                    ).catch(next);

                    Video.deleteOne({ _id: _id }).catch(next);
                }
                res.send(true);
                break;
            case 'restores':
                for (const _id of req.body.videoIDs) {
                    Video.restore({ _id: _id }).catch(next);
                }
                res.send(true);
                calculatorTimeCourse(req.params._id)
                break;
            default:
                res.send(false);
        }
    }
}

module.exports = new MeController();
