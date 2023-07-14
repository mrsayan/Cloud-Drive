const express = require("express");
const viewController = require('../controllers/viewController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true });

router.use(authController.isLoggedIn)
router.get("/", viewController.home);
router.get("/files", viewController.files);
router.get("/download/:id",viewController.download);
router.get("/contact", viewController.contact);
router.get("/login", viewController.login);
router.get("/dashboard",authController.protect,authController.restrictTo('admin' , 'sub-admin'), viewController.addFile);
router.get("/dashboard/add-user",authController.protect,authController.restrictTo('admin'), viewController.addUser);
router.get("/dashboard/add-folder",authController.protect,authController.restrictTo('admin'), viewController.addFolder);
router.get("/dashboard/folder/:id",authController.protect,authController.restrictTo('admin' , 'sub-admin'), viewController.folder);
module.exports = router;
