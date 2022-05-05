const express = require('express');
const router = express.Router();
const meController = require('../app/controllers/MeController');

router.get('/stored/courses', meController.storeCourses);
router.get('/stored/:id/getMember', meController.getMember);
router.get('/stored/deletedCount', meController.deletedCount);
router.get('/trash/courses', meController.trashCourses);
//edit section
router.post('/stored/:id/addSection', meController.addSection);
router.post('/stored/:id/updateSection', meController.updateSection);
router.post('/stored/moveSection', meController.moveSection);
router.post('/stored/deleteSection', meController.deleteSection);
//edit video
router.get('/stored/:id/editCourse', meController.show);
router.get('/stored/:id/editCourse/countDeleteVideo', meController.countDeleteVideo);
router.put('/stored/:id/:sectionID', meController.storeVideo);
// router.get('/stored/:id/edit/addvideo', meController.addVideo);
router.post('/stored/:id/edit/:sectionID/:_id/:action', meController.actionVideo);
// update video
// router.get('/stored/:id/edit/:_id/update', meController.updateVideo);
router.put('/stored/:id/:sectionID/edit/:_id/update', meController.putUpdateVideo);
// trash video
router.get('/trash/:id', meController.showTrashVideo);
router.patch('/trash/:_id/restore/:id', meController.restoreVideo);
router.delete('/trash/:_id/delete/:id/force', meController.forceDeleteVideo);
router.post(
    '/trash/:_id/handle-form-actions-trash',
    meController.handleFormTrashVideoActions,
);
// upload video
router.post('/upload', meController.upload);
router.delete('/upload/:id', meController.deleteUpload);
// upload document
router.post('/upload/:sectionID', meController.uploadDocs);
router.delete('/delete/:sectionID', meController.deleteUploadDocs);
module.exports = router;
// lockUser
router.post('/lockUser', meController.lockUser);
router.post('/unLockUser', meController.unLockUser);

