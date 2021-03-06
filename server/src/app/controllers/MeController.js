const Course = require('../models/Course');
const LiveStream = require('../models/LiveStream');
const Section = require('../models/Section');
const Video = require('../models/Video');
const Document = require('../models/Document');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const { populate } = require('../models/Video');
const { course } = require('./CourseController');
const processFile = require("../middlewares/upload");
const processFileDocs = require("../middlewares/uploadDocs");
const { format } = require("util");
// const { Storage } = require("@google-cloud/storage");
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { User } = require('../models/User');
const command = ffmpeg();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

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
    var time = 0;
    const course = await Course.findById(id)
    .populate({ 
        modal: 'section', 
        path: 'sections',
        populate: {
            path: 'videos',
            modal: 'video',
        },
    })
    course.sections.map(section => {
        section.videos.map(video => {
            time += video.time
        })
    })
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
    async show(req, res, next) {
        try {
            const course = await Course.findById(req.params.id)
            .populate({ 
                modal: 'section', 
                path: 'sections',
                populate: [{
                    path: 'videos',
                    modal: 'video',
                },
                {
                    path: 'docs',
                    modal: 'document',
                }]
            })
            .populate({ modal: 'user', path: 'actor' })
            .populate({ modal: 'livestream', path: 'livestreams' })
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

    // POST /me/stored/:id/addSection
    addSection(req, res, next) {
        try {
            var section = new Section(req.body)
            section.save()
                .then(section => {
                    const course = Course.findByIdAndUpdate(
                        req.params.id, 
                        {$addToSet: {sections: section._id}},
                    ).then()
                    res.send(true)
                })
        } catch(err) {
            res.send(false)
        }
    }

    // POST /me/stored/:id/updateSection
    updateSection(req, res, next) {
        try {
            Section.findByIdAndUpdate(
                req.params.id,
                {name: req.body.name},
            ).then()
            res.send(true)
        } catch(err) {
            res.send(false)
        }
    }

    // POST /me/stored/moveSection
    moveSection(req, res, next) {
        // console.log(req.body);
        Course.findById(req.body.courseID)
            .then(course => {
                var newArr = []
                var newIndex
                var index = course.sections.indexOf(req.body.sectionID)
                switch(req.body.action) {
                    case "down":
                        if (index === course.sections.length-1) {
                            newIndex = 0
                        } else 
                            newIndex = index + 1
                        break;
                      case "up":
                        if (index === 0) {
                            newIndex = course.sections.length-1
                        } else 
                            newIndex = index - 1
                        break;
                }
                // console.log(index, newIndex);
                newArr = array_move(course.sections, index, newIndex)
                // console.log(newArr);
                Course.findByIdAndUpdate(req.body.courseID, {sections: newArr}).then()
            })
        res.send(true)
    }
    // POST /me/stored/deleteSection
    deleteSection(req, res, next) {
        // console.log(req.body);
        Course.findByIdAndUpdate(req.body.courseID, {$pull : {sections: req.body.sectionID}}).then()
        Section.findByIdAndDelete(req.body.sectionID)
            .then(section => {
                section.videos.map(videoID => {
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
                section.docs.map(docID => {
                    Document.findByIdAndDelete(docID)
                    .then(doc => {
                        var filePath = `src/public/docs/${doc.name}`;
                        fs.unlinkSync(filePath);
                    })
                })
            })
        calculatorTimeCourse(req.body.courseID)
        res.send(true)
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
        
    // // GET /me/stored/:id//edit/addVideo
    // addVideo(req, res, next) {
    //     Course.findById(req.params.id)
    //         .then((course) =>
    //             res.render('me/editVideo', {
    //                 title: 'Th??m video cho kh??a h???c',
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
                    Section.findById({ _id: req.params.sectionID })
                        .then((section) => {
                            var arr = section.videos;
                            var pos = arr.indexOf(req.params._id);
                            var pos1 = pos - 1;
                            if (pos == 0) {
                                pos1 = arr.length - 1;
                            }
                            arr = array_move(arr, pos, pos1);
                            // console.log(arr, pos, pos1);
                            Section.findOneAndUpdate(
                                { _id: req.params.sectionID },
                                { videos: arr },
                            )
                                .then(() => {
                                    res.send(true);
                                })
                                .catch(next);
                        })
                        .catch(next);
                    break;
                case 'delete':
                    try {
                        var time;
                        Section.updateOne(
                            { _id: req.params.sectionID },
                            { $pull: { videos: req.params._id } },
                            { new: true, useFindAndModify: false },
                        ).catch(next);
                
                        Video.findByIdAndDelete({ _id: req.params._id })
                            .then((video) => {
                                time = video.time
                                if(video.videoID.length > 13) {
                                var filePath = `src/public/video/${video.videoID}`;
                                var thumbnailPath = `src/public/img/thumbnail/${video.videoID.substring(0,video.videoID.lastIndexOf("."))}.png`;
                                fs.unlinkSync(filePath);
                                fs.unlinkSync(thumbnailPath);
                                }
                                res.send(true)
                            })
                            .catch(next => {
                                res.send(false)
                            });
                            calculatorTimeCourse(req.params.id)
                    } catch (err) {
                        res.send(false)
                    }
                    break;
                case 'next':
                    Section.findById({ _id: req.params.sectionID })
                        .then((section) => {
                            var arr = section.videos;
                            var pos = arr.indexOf(req.params._id);
                            var pos1 = pos + 1;
                            if (pos == arr.length - 1) {
                                pos1 = 0;
                            }
                            arr = array_move(arr, pos, pos1);
                            // console.log(arr, pos, pos1);
                            Section.findOneAndUpdate(
                                { _id: req.params.sectionID },
                                { videos: arr },
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
    //                 title: 'C???p nh???t video kh??a h???c',
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

    // PUT me/stored/:id/:sectionID/edit/:_id/update
    putUpdateVideo(req, res, next) {
        // console.log(req.params)
        if(req.params.sectionID !== 'undefined') {
            Video.findByIdAndUpdate({_id: req.params._id}, {
                name: req.body.name,
                description: req.body.description,
            })
            .then(video => {
                // console.log(video);
                res.send(true);
            })
            .catch(next);
        } else {
            LiveStream.findByIdAndUpdate({_id: req.params._id}, {
                name: req.body.name,
                description: req.body.description,
            })
            .then(video => {
                // console.log(video);
                res.send(true);
            })
            .catch(next);
        }
    }

    // PUT /me/stored/:id/:sectionID
    async storeVideo(req, res, next) {
        // res.json(req.body)
        try {
            const course = await Course.findByIdAndUpdate({ _id: req.params.id }, {$inc: {time: +req.body.time}});
            // console.log(typeof(course._id))
            if (req.body.videoID.length < 13) {
                req.body.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
            } else {
                var proc = new ffmpeg(`./src/public/video/${req.body.videoID}`)
                    .takeScreenshots({
                        count: 1,
                        timemarks: [ `${req.body.time/2}` ],
                        filename: `${req.body.videoID.substring(0,req.body.videoID.lastIndexOf("."))}.png`
                        }, `./src/public/img/thumbnail/`, function(err) {
                        console.log('screenshots were saved')
                    });
                req.body.image = `/img/thumbnail/${req.body.videoID.substring(0,req.body.videoID.lastIndexOf("."))}.png`;
            }
            const video = new Video(req.body);
            video
                .save()
                .then(
                    (video) => {
                        Section.findByIdAndUpdate(
                            req.params.sectionID,
                            { $addToSet: { videos: video._id } },
                            { new: true, useFindAndModify: false },
                        ).then()
                        res.send(true)
                    }
                )
                .catch(next => {
                    res,send(false)
                });
        } catch (err) {
            console.log(err);
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
    async forceDeleteVideo(req, res, next) {
        // res.json(req.params)
        try {
            Course.updateOne(
                { _id: req.params._id },
                { $pull: { video: req.params.id } },
                { new: true, useFindAndModify: false },
            ).catch(next);
    
            Video.findByIdAndDelete({ _id: req.params.id })
                .then((video) => {
                    if(video.videoID.length > 13) {
                    var filePath = `src/public/video/${video.videoID}`;
                    var thumbnailPath = `src/public/img/thumbnail/${video.videoID.substring(0,video.videoID.lastIndexOf("."))}.png`;
                    fs.unlinkSync(filePath);
                    fs.unlinkSync(thumbnailPath);
                    }
                    res.send(true)
                })
                .catch(next => {
                    res.send(false)
                });
        } catch (err) {
            res.send(false)
        }

    }

    // POST /me/trash/:_id/handle-form-actions-trash
    handleFormTrashVideoActions(req, res, next) {
        try {
            switch (req.body.action) {
                case 'delete':
                    for (const _id of req.body.videoIDs) {
                        Course.updateMany(
                            { _id: req.params._id },
                            { $pull: { video: _id } },
                            { new: true, useFindAndModify: false },
                        ).catch(next);
    
                        // Video.deleteOne({ _id: _id }).catch(next);
                        Video.findByIdAndDelete({ _id: _id })
                        .then((video) => {
                            if(video.videoID.length > 13) {
                                var filePath = `src/public/video/${video.videoID}`;
                                var thumbnailPath = `src/public/img/thumbnail/${video.videoID.substring(0,video.videoID.lastIndexOf("."))}.png`;
                                fs.unlinkSync(filePath);
                                fs.unlinkSync(thumbnailPath);
                            }
                        })
                        .catch(next);
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
        } catch(err) {
            res.send(false)
        }
    }
    // DELETE /me/upload/:id
    async deleteUpload(req, res, next) {
        try {
            if(req.params.id.length > 13) {
                var filePath = `src/public/video/${req.params.id}`;
                await fs.unlinkSync(filePath);
            }
            res.send(true)
          } catch (error) {
            console.error('there was an error:', error.message);
            res.send(false)
          }
    }
    // POST /me/upload
    async upload(req, res, next) {
        try {
            await processFile(req, res);
            if (!req.file) {
                return res.send("Please upload a file!");
            }
            res.send(req.file)
        } catch (err) {
            res.send({
            message: `Could not upload the file: ${name}. ${err}`,
            });
        }
    }

    // POST me/upload/:sectionID
    async uploadDocs(req, res, next) {
        try {
            await processFileDocs(req, res);
            if (req.file) {
                const doc = new Document({name: req.file.filename, size: req.file.size})
                doc.save()
                .then(document => {
                    Section.findByIdAndUpdate(req.params.sectionID, {$addToSet: {docs: document._id}})
                    .then()
                })
                res.send(req.file)
            }
        } catch (err) {
            res.send({
            message: `Could not upload the file: ${err}`,
            });
        }
    }

    // DELETE me/delete/:sectionID
    async deleteUploadDocs(req, res, next) {
        // console.log(req.body);
        try {
            Document.deleteOne({_id: req.body.docID}).then()
            Section.findByIdAndUpdate({_id: req.body.sectionID}, {$pull: {docs: req.body.docID}})
                .then()
            var filePath = `src/public/docs/${req.body.docName}`;
            await fs.unlinkSync(filePath);
            res.send(true)
        } catch (error) {
            console.error('there was an error:', error.message);
            res.send(false)
        }
    }

    // get /me/stored/:id/getMember
    async getMember(req, res, next) {
        try {
            User.findWithDeleted({$or: [{joined: req.params.id}, {banned: req.params.id}]})
            .then((users) => {
                res.send(users)
            })
            .catch(next)
        } catch (err) {
            res.send([])
        }
    }

    // POST /me/lockUser/
    async lockUser(req, res, next) {
        // console.log(req.body);
        try {
            User.findByIdAndUpdate({_id: req.body.memberID},
                {$pull: {joined: req.body.courseID}},
            ).then()
            User.findByIdAndUpdate({_id: req.body.memberID},
                {$addToSet: {banned: req.body.courseID}}
            ).then()
            res.send(true)
        } catch (err) {
            res.send(false)
        }
    }

    // POST /me/lockUser/
    async unLockUser(req, res, next) {
        // console.log(req.body);
        try {
            User.findByIdAndUpdate({_id: req.body.memberID},
                {$pull: {banned: req.body.courseID}},
            ).then()
            User.findByIdAndUpdate({_id: req.body.memberID},
                {$addToSet: {joined: req.body.courseID}}
            ).then()
            res.send(true)
        } catch (err) {
            res.send(false)
        }
    }
}

module.exports = new MeController();
