const express = require("express");
const viewController = require('../controllers/viewController')
const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')
const router = express.Router({ mergeParams: true });

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/add-user",authController.protect,authController.restrictTo('admin'), apiController.addUser);
router.post("/remove-user",authController.protect,authController.restrictTo('admin'), apiController.removeUser);
router.post("/remove-file",authController.protect,authController.restrictTo('admin'), apiController.removeFile);
router.post("/move-file", authController.protect,authController.restrictTo('admin'),apiController.moveFile);
router.post("/add-file", authController.protect,authController.restrictTo('admin' , 'sub-admin'),apiController.addFile);
router.post("/add-folder", authController.protect,authController.restrictTo('admin'),apiController.addFolder);
router.post("/add-permission", authController.protect,authController.restrictTo('admin'),apiController.addPermission);
router.get("/download/:id", apiController.download);
module.exports = router;
