const Course = require('../models/Course');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
const moment = require('moment');
const { array } = require('joi');
const { User } = require('../models/User');
const { countDocuments } = require('../models/Course');
const { json } = require('express');

class CourseController {
    // GET /courses/cJoin
    async cJoin(req, res, next) {
        let id = null
        try {
            id = req.session.passport.user._id
        } catch{}
        if (id) {
            const user = await User.findById({
                _id: id,
            }).catch(next);
            const courses = await Course.aggregate([
                {
                    $match: { _id: { $in: user.joined } },
                },
                {
                    $lookup: {
                        from: 'users', // collection to join
                        localField: '_id', //field from the input documents
                        foreignField: 'joined', //field from the documents of the "from" collection
                        as: 'student', // output array field
                    },
                },
                {
                    $addFields: { studentCount: { $size: '$student' } },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(courses, { modal: 'user', path: 'actor' }).catch(next);
            res.send(courses);
        } else  {
            res.send([]);
        }
    }
    // GET /courses/cUpdate
    async cUpdate(req, res, next) {
        let id = null
        try {
            id = req.session.passport.user._id
        } catch{}
        if (id) {
            const coursesNew = await Course.aggregate([
                {
                    $lookup: {
                        from: 'users', // collection to join
                        localField: '_id', //field from the input documents
                        foreignField: 'joined', //field from the documents of the "from" collection
                        as: 'student', // output array field
                    },
                },
                {
                    $addFields: { studentCount: { $size: '$student' } },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(coursesNew, {
                modal: 'user',
                path: 'actor',
            }).catch(next);
            res.send(coursesNew);
        } else  {
            res.send([]);
        }
    }
    // GET /courses/cPopular
    async cPopular(req, res, next) {
        let id = null
        try {
            id = req.session.passport.user._id
        } catch{}
        if (id) {
            const courseFA = await Course.aggregate([
                {
                    $lookup: {
                        from: 'users', // collection to join
                        localField: '_id', //field from the input documents
                        foreignField: 'joined', //field from the documents of the "from" collection
                        as: 'student', // output array field
                    },
                },
                {
                    $addFields: { studentCount: { $size: '$student' } },
                },
                {
                    $sort: { studentCount: -1 },
                },
                {
                    $limit: 4,
                },
            ]).catch(next);
            await Course.populate(courseFA, { modal: 'user', path: 'actor' }).catch(
                next,
            );
            res.send(courseFA);
        } else  {
            res.send([]);
        }
    }
    // GET /courses/cAnother
    async cAnother(req, res, next) {
        let id = null
        try {
            id = req.session.passport.user._id
        } catch{}
        if (id) {
            const user = await User.findById({
                _id: id,
            }).catch(next);
            const coursesAnother = await Course.aggregate([
                {
                    $match: { _id: { $nin: user.joined } },
                },
                {
                    $lookup: {
                        from: 'users', // collection to join
                        localField: '_id', //field from the input documents
                        foreignField: 'joined', //field from the documents of the "from" collection
                        as: 'student', // output array field
                    },
                },
                {
                    $addFields: { studentCount: { $size: '$student' } },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(coursesAnother, {
                modal: 'user',
                path: 'actor',
            }).catch(next);
            res.send(coursesAnother);
        } else  {
            res.send([]);
        }
    }
    // GET /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .populate('video')
            .then((course) => {
                // res.json(course);
                res.render('courses/show', {
                    title: req.params.slug,
                    course: mongooseToObject(course),
                    username: req.session.passport,
                });
            })
            .catch(next);
        // res.send('Course Detail - ' + req.params.slug);
    }
    // POST /courses/addComment <AJAX>
    addComment(req, res, next) {
        // console.log(req.body);
        const comment = new Comment(req.body);
        comment.actor = req.session.passport.user._id;
        comment
            .save()
            .then(() => {
                res.send('true');
            })
            .catch(next);
    }

    // POST /courses/refreshComment <AJAX>
    async refreshComment(req, res, next) {
        // console.log(req.body);
        await Comment.find({ videoID: req.body.videoID })
            .sort({ createdAt: -1 })
            .populate({ modal: 'user', path: 'actor' })
            .then((comment) => {
                res.send(comment);
            })
            .catch(next);
    }

    // POST /courses/store
    store(req, res, next) {
        // res.json(req.body)
        var array = [
            '?technology',
            '?nature',
            '?color',
            '?cpu',
            '?Coutryside',
            '?Fruit',
            '?Vegatables',
            '?people',
            '?ai',
            '?sunny',
        ];
        var randomElement = array[Math.floor(Math.random() * array.length)];
        req.body.image = `https://source.unsplash.com/random/306x230/${randomElement}`;
        const course = new Course(req.body);
        course.actor = req.session.passport.user._id;
        course
            .save()
            .then(
                () =>
                    User.findOneAndUpdate(
                        { _id: req.session.passport.user._id },
                        { $push: { khoahoc: course._id } },
                        { new: true, useFindAndModify: false },
                    ),
                res.redirect('/me/stored/courses'),
            )
            .catch(next);
    }

    // PUT /courses/:id
    update(req, res, next) {
        // res.json(req.body)
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // DELETE /courses/:id
    delete(req, res, next) {
        // res.json(req.body)
        Course.delete({ _id: req.params.id })
            .then((course) => res.redirect('back'))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // DELETE /courses/:id/forceDelete
    forceDelete(req, res, next) {
        //res.json(req.params)
        User.updateMany(
            {},
            { $pull: { khoahoc: req.params.id } },
            { new: true, useFindAndModify: false },
        ).catch(next);

        Course.findOneDeleted({ _id: req.params.id })
            .then((course) => {
                // console.log(course);
                if (course != null) {
                    for (const _id of course.video) {
                        Video.deleteOne({ _id: _id }).catch(next);
                    }
                }
            })
            .catch(next);

        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // POST /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
    }

    // POST /courses/handle-form-actions-trash
    handleFormTrashActions(req, res, next) {
        // res.json(req.body.courseIds)
        switch (req.body.action) {
            case 'delete':
                for (const _id of req.body.courseIds) {
                    User.updateMany(
                        {},
                        { $pull: { khoahoc: _id } },
                        { new: true, useFindAndModify: false },
                    ).catch(next);

                    Course.findOneDeleted({ _id: _id })
                        .then((course) => {
                            // console.log(course.video);
                            for (const _id of course.video) {
                                Video.deleteOne({ _id: _id }).catch(next);
                            }
                        })
                        .catch(next);

                    Course.deleteOne({ _id: _id }).catch(next);
                }
                res.redirect('back');
                break;
            case 'restores':
                for (const _id of req.body.courseIds) {
                    Course.restore({ _id: _id }).catch(next);
                }
                res.redirect('back');
                break;
            default:
                res.json({ message: 'Action is invalid!' });
        }
    }

    // POST /courses/checkThamgia
    async checkThamgia(req, res, next) {
        await User.findById({ _id: req.session.passport.user._id })
            .populate({ modal: 'course', path: 'khoahoc' })
            .then((user) => {
                var check = 0;
                user.khoahoc.forEach(function (element, index) {
                    // Do your thing, then:
                    if (element.slug == req.body.slug) {
                        return (check = 1);
                    }
                });
                res.send(check.toString());
            })
            .catch(next);
    }

    // POST /courses/thamGia
    async thamGia(req, res, next) {
        const course = await Course.find({ slug: req.params.slug });
        // console.log(course);
        // console.log(course[0]._id);
        User.findOneAndUpdate(
            { _id: req.session.passport.user._id },
            { $push: { khoahoc: course[0]._id } },
            { new: true, useFindAndModify: false },
        )
            .then(() => {
                res.redirect('/courses/show/' + req.params.slug);
            })
            .catch(next);
    }

    // // POST /courses/getNumUser <AJAX>
    // getNumUser(req, res, next) {
    //     // console.log(req.body);
    //     Course.findOne(req.body)
    //         .then((course) => {
    //             // console.log(course._id)
    //             User.countDocuments({ khoahoc: course }).then((count) => {
    //                 res.send(count.toString());
    //             });
    //         })
    //         .catch(next);
    // }

    // POST /checkUnlock <AJAX>
    checkUnlock(req, res, next) {
        // console.log(req.body);
        Video.findOne(
            {
                _id: req.body._id,
                unlock: req.session.passport.user._id,
            },
            function (err, doc) {
                if (doc === null) {
                    res.send('false');
                    // console.log(doc);
                    return false; // this will return undefined to the controller
                } else {
                    res.send('true');
                    // console.log(doc);
                    return true; // this will return undefined to the controller
                }
            },
        );
    }

    // POST /unlockFirstVideo <AJAX>
    unlockVideo(req, res, next) {
        // console.log(req.body);
        Video.findOne(
            {
                _id: req.body._id,
                unlock: req.session.passport.user._id,
            },
            function (err, doc) {
                if (doc === null) {
                    Video.updateOne(
                        { _id: req.body._id },
                        { $push: { unlock: req.session.passport.user._id } },
                    )
                        .then((video) => {
                            res.send('true');
                        })
                        .catch(next);
                    return true;
                } else {
                    res.send('false');
                    return false;
                }
            },
        );
    }

    // POST /search <AJAX>
    async search(req, res, next) {
        // res.send(req.body.videoID);
        if (req.body.name == '') {
            res.send([]);
        } else {
            // console.log(req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            Course.find({
                name: new RegExp(
                    `${req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                    'i',
                ),
            })
                .populate({ modal: 'user', path: 'actor' })
                .then((courses) => {
                    res.send(courses);
                })
                .catch(next);
        }
    }
}
module.exports = new CourseController();
