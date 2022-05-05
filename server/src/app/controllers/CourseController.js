const Course = require('../models/Course');
const Comment = require('../models/Comment');
const Video = require('../models/Video');;
const LiveStream = require('../models/LiveStream');
const Section = require('../models/Section');
const Document = require('../models/Document');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
const moment = require('moment');
const { array } = require('joi');
const { User } = require('../models/User');
const { countDocuments, populate } = require('../models/Course');
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
                    $addFields: { user: user._id },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(courses, 
                [{ modal: 'user', path: 'actor' }, { modal: 'section', path: 'sections', populate: { modal: 'video', path: 'videos' } }])
            .catch(next);
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
                    $addFields: { user: req.session.passport.user._id },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(coursesNew, 
                [{ modal: 'user', path: 'actor' }, { modal: 'section', path: 'sections', populate: { modal: 'video', path: 'videos' } }])
            .catch(next);
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
                    $addFields: { user: req.session.passport.user._id },
                },
                {
                    $sort: { studentCount: -1 },
                },
            ]).catch(next);
            await Course.populate(courseFA, 
                [{ modal: 'user', path: 'actor' }, { modal: 'section', path: 'sections', populate: { modal: 'video', path: 'videos' } }])
            .catch(next);
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
                    $addFields: { user: req.session.passport.user._id },
                },
                {
                    $sort: { updatedAt: -1 },
                },
            ]).catch(next);
            await Course.populate(coursesAnother, 
                [{ modal: 'user', path: 'actor' }, { modal: 'section', path: 'sections', populate: { modal: 'video', path: 'videos' } }])
            .catch(next);
            res.send(coursesAnother);
        } else  {
            res.send([]);
        }
    }
    // GET /courses/show/:slug
    show(req, res, next) {
        try {
            Course.findOne({ slug: req.params.slug })
            .populate( 
                [{ modal: 'user', path: 'actor' }, { modal: 'section', path: 'sections', populate: { modal: 'video', path: 'videos' } }]
            )
            .then((course) => {
                // res.json(course);
                res.send(course);
            })
            .catch(next => {
                res.send(false)
            });
        } catch(err) {
            res.send(false)
        }
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
        // console.log(req.body)
        var array = [
            '?technology',
            '?cpu',
            '?ai',
            '?Frontend',
            '?backend',
            '?code',
            '?study'
        ];
        var randomElement = array[Math.floor(Math.random() * array.length)];
        req.body.image = `https://source.unsplash.com/random/306x230/${randomElement}`;
        const course = new Course(req.body);
        course.actor = req.session.passport.user._id;
        course
            .save()
            .then(() => {
                // console.log(course._id);
                User.findOneAndUpdate(
                    { _id: req.session.passport.user._id },
                    { $addToSet: { joined: course._id } },
                    { new: true, useFindAndModify: false },
                )
                .then()
                res.send(true)
            })
            .catch(MongoError => {
                res.send("Khóa học đã tồn tại trong thùng rác! Vui lòng xóa trước khi tạo lại!")
            });
    }

    // PUT /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body.course)
            .then(() => res.send(true))
            .catch(next);
    }

    // DELETE /courses/:id
    delete(req, res, next) {
        // res.json(req.body)
        Course.delete({ _id: req.params.id })
            .then((course) => res.send(true))
            .catch(next);
    }

    // PATCH /courses/:id/restore
    restore(req, res, next) {
        try {
            Course.restore({ _id: req.params.id })
            .then(() => res.send(true))
            .catch(next => {
                res.send(false)
            });
        } catch (err) {
            res.send(false)
        }
    }
    // DELETE /courses/:id/forceDelete
    forceDelete(req, res, next) {
        //res.json(req.params)
        User.updateMany(
            {},
            { $pull: { joined: req.params.id } },
            { new: true, useFindAndModify: false },
        ).catch(next);

        Course.findOneDeleted({ _id: req.params.id })
            .then((course) => {
                // console.log(course);
                if (course != null) {
                    for (var _id of course.sections) {
                        Section.findByIdAndDelete({ _id }).then((sections) => {
                            sections.videos.map(videoID => {
                                Video.findByIdAndDelete(videoID)
                                .then(video => {
                                    if(video.videoID.length > 13) {
                                        var filePath = `src/public/video/${video.videoID}`;
                                        var thumbnailPath = `src/public/img/thumbnail/${video.videoID.substring(0,video.videoID.lastIndexOf("."))}.png`;
                                        fs.unlinkSync(filePath);
                                        fs.unlinkSync(thumbnailPath);
                                    }
                                })
                            })
                            sections.docs.map(docID => {
                                Document.findByIdAndDelete(docID)
                                .then(doc => {
                                    var filePath = `src/public/docs/${doc.name}`;
                                    fs.unlinkSync(filePath);
                                })
                            })
                        })
                    }
                }
            })
            .catch(next);

        Course.deleteOne({ _id: req.params.id })
            .then(() => res.send(true))
            .catch(next);
    }
    // POST /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.send(true))
                    .catch(next);
                break;
            default:
                res.send('Action is invalid!');
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
                        { $pull: { joined: _id } },
                        { new: true, useFindAndModify: false },
                    ).catch(next);

                    Course.findOneDeleted({ _id: _id })
                        .then((course) => {
                            // console.log(course.video);
                            for (const _id of course.sections) {
                                Section.findByIdAndDelete({ _id: _id }).then(sections => {
                                    sections.videos.map(videoID => {
                                        Video.findByIdAndDelete(videoID)
                                        .then(video => {
                                            if(video.videoID.length > 13) {
                                                var filePath = `src/public/video/${video.videoID}`;
                                                var thumbnailPath = `src/public/img/thumbnail/${video.videoID.substring(0,video.videoID.lastIndexOf("."))}.png`;
                                                fs.unlinkSync(filePath);
                                                fs.unlinkSync(thumbnailPath);
                                            }
                                        })
                                    })
                                    sections.docs.map(docID => {
                                        Document.findByIdAndDelete(docID)
                                        .then(doc => {
                                            var filePath = `src/public/docs/${doc.name}`;
                                            fs.unlinkSync(filePath);
                                        })
                                    })
                                })
                            }
                        })
                        .catch(next);

                    Course.deleteOne({ _id: _id }).catch(next);
                }
                res.send(true);
                break;
            case 'restores':
                for (const _id of req.body.courseIds) {
                    Course.restore({ _id: _id }).catch(next);
                }
                res.send(true);
                break;
            default:
                res.send('Action is invalid!');
        }
    }

    // POST /courses/checkThamgia
    async checkThamgia(req, res, next) {
        await User.findById({ _id: req.session.passport.user._id })
            .populate({ modal: 'course', path: 'joined' })
            .then((user) => {
                // console.log(user);
                var check = 0;
                user.joined.forEach(function (element, index) {
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
        const course = await Course.find({ slug: req.params.slug })
        // console.log(course);
        // console.log(course[0]._id);
        // const id = course[0]._id
        try {
            // console.log(req.session.passport.user.joined);
            User.findOneAndUpdate(
                { _id: req.session.passport.user._id},
                { $addToSet: { joined: course[0]._id } },
                { new: true, useFindAndModify: false },
            )
                .then(() => {
                    res.send("true");
                })
                .catch(next => {
                    res.send("false");
                });
        }catch (UnhandledPromiseRejectionWarning) {
            res.send("false");
        }
    }

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
                        { $addToSet: { unlock: req.session.passport.user._id } },
                    )
                        .then((video) => {
                            res.send(true);
                        })
                        .catch(next);
                } else {
                    res.send(false);
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
            Course.find({ $or: [
                {'name': new RegExp(
                    `${req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                    'i',
                )},
                {'description': new RegExp(
                    `${req.body.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
                    'i',
                )},
            ]})
                .populate({ modal: 'user', path: 'actor' })
                .then((courses) => {
                    res.send(courses);
                })
                .catch(next);
        }
    }
}
module.exports = new CourseController();
