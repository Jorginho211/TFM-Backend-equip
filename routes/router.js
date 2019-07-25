const express = require("express");
const router = express.Router();


/* API routes */
router.use("/user", require('./userRoutes'));
router.use("/place", require('./placeRoutes'));
router.use("/equipment", require('./equipmentRoutes'));

module.exports = router;