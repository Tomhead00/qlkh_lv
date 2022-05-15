const Course = require('../models/Course');
const { User } = require('../models/User');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const { multipleMongooseToObject } = require('../../util/mongoose');

class ManagerController {
    // GET /account
    // async account(req, res, next) {
    //     let accountAdmin = await User.find({ role: 'admin' });
    //     let accountUser = await User.find({ role: 'user' });
    //     let accountBlock = await User.countDocumentsDeleted();
    //     res.render('manager/account', {
    //         title: 'Quản lý tài khoản',
    //         accountAdmin: multipleMongooseToObject(accountAdmin),
    //         accountUser: multipleMongooseToObject(accountUser),
    //         accountBlock,
    //         username: req.session.passport,
    //     });
    // }
    async admin(req, res, next) {
        try {
            User.find({ role: 'admin' }).sort({username: -1}).exec(function(err, docs) {
                res.send(docs)
            });
            } catch (err) {}
    }

    member(req, res, next) {
        // console.log("member" , req.query);
        try {
            let accountMember = User.find({ role: 'member' });
    
            if (req.query.hasOwnProperty('_sort')) {
                accountMember = accountMember.sort({
                    [req.query.column]: req.query.type,
                });
            }
            Promise.all([accountMember]).then(
                (member) =>
                    res.send(member),
            );
        } catch (err) {}
    }

    // GET /blocked
    async blocked(req, res, next) {
        try {
            let blocked = User.findDeleted({});
    
            if (req.query.hasOwnProperty('_sort')) {
                blocked = blocked.sort({
                    [req.query.column]: req.query.type,
                });
            }
            Promise.all([blocked]).then(
                (blocked) =>
                    res.send(blocked),
            );
        } catch (err) {}
    }

    // DELETE /:id
    async block(req, res, next) {
        try {
            Course.find({ actor: req.params.id })
            .then((courses) => {
                for (const course of courses) {
                    Course.delete({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        User.delete({ _id: req.params.id })
            .then(() => res.send(true))
            .catch(next);
        } catch (err) {
            res.send(false)
        }
    }

    // PATCH /:id
    async restore(req, res, next) {
        try {
            Course.findDeleted({ actor: req.params.id })
            .then((courses) => {
                for (const course of courses) {
                    Course.restore({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        await User.updateOneDeleted({ _id: req.params.id }, { role: 'member' });

        User.restore({ _id: req.params.id })
            .then(() => res.send(true))
            .catch(next => {
                res.send(false)
            });
        } catch (err) {
            res.send(false)
        }
    }

    // DELETE /:id
    async delete(req, res, next) {
        try {
            Course.find({ actor: req.params.id })
            .then((courses) => {
                console.log(courses);
                for (const course of courses) {
                    console.log(course);
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
                        course.livestreams.map((id, index) => {
                            LiveStream.findByIdAndDelete(id)
                            .then(videoLive => {
                                var filePath = `src/public/livestream/${videoLive.liveID}`;
                                var thumbnailPath = `src/public/img/thumbnail/${videoLive.liveID.substring(0,videoLive.liveID.lastIndexOf("."))}.png`;
                                fs.unlinkSync(filePath);
                                fs.unlinkSync(thumbnailPath);
                            })
                        })
                    }
                    Course.deleteOne({ _id: course._id }).catch(next);
                }
            })
            .catch(next);

        User.deleteOne({ _id: req.params.id })
            .then((user) => {
                res.send(true);
            })
            .catch(next => [
                res.send(false)
            ]);
        } catch {
            res.send(false)
        }
    }

    // POST /:id/down
    async down(req, res, next) {
        User.countDocuments({role: 'admin'})
        .then(async count => {
            // console.log(count);
            if(count > 1) {
                await User.updateOne({ _id: req.params.id }, { role: 'member' });
                res.send(true);
            } else {
                res.send(false)
            }
        })
    }

    // POST /:id/up
    async up(req, res, next) {
        User.countDocuments({role: 'admin'})
        .then(async count => {
            // console.log(count);
            if(count < 5) {
                await User.updateOne({ _id: req.params.id }, { role: 'admin' });
                res.send(true);
            } else {
                res.send(false)
            }
        })
    }

    // ------------------ Courses ------------------
    // GET /courses
    async courses(req, res, next) {
        try {
            let courseQuery = Course.find({}).populate({
                modal: 'user',
                path: 'actor',
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

    // GET /TrashCourses
    async TrashCourses(req, res, next) {
        try {
            let courseQuery = Course.findDeleted({}).populate({
                modal: 'user',
                path: 'actor',
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
}

module.exports = new ManagerController();
