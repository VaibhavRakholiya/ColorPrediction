const express = require("express");
const { adminController } = require("../../controller/admin");
const { gameHistoryController } = require("../../controller/gamehistory");
const { auth } = require("../../middleware/auth");
const router = express.Router();

router.get("/", adminController?.loadPage);
router.get("/dashboard", adminController?.loadDashboard);
router.get("/child-registration", auth, adminController?.loadChildRegistration);
router.get("/change-password", auth, adminController?.changePassword);
router.get("/change-pin", auth, adminController?.changePin);
router.get("/update-profile", auth, adminController?.updateProfile);
router.get("/drew-details", adminController?.drewDetails);
router.get("/contact-us", auth, adminController?.contactUs);
router.get("/pin-password", auth, adminController?.pinPassword);

router.post("/gamehistory", gameHistoryController?.getGameHistory);

module.exports = router;
