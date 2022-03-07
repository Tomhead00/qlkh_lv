const express = require('express');
const router = express.Router();
const managerController = require('../app/controllers/ManagerController');

router.get('/admin', managerController.admin);
router.get('/member', managerController.member);
// account
// block account
router.delete('/:id', managerController.block);
router.get('/blocked', managerController.blocked);

// restore account
router.patch('/:id', managerController.restore);

// force account
router.delete('/:id/force', managerController.delete);

// role
router.post('/:id/down', managerController.down);
router.post('/:id/up', managerController.up);

// ------------- courses ---------------------
router.get('/courses', managerController.courses);
router.get('/TrashMnCourses', managerController.TrashCourses);

module.exports = router;
