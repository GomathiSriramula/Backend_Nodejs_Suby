const express = require("express");
const firmController = require("../controllers/firmController");
const verifyToken = require("../midlewares/verifyToken");
const router = express.Router();

router.post("/add-firm", verifyToken, firmController.addFirm);

router.put("/update-firm/:firmId", verifyToken, firmController.updateFirm);

// Image serving is handled by app.use('/uploads', express.static('uploads'))

router.delete("/:firmId", firmController.deleteFirmById);

module.exports = router;