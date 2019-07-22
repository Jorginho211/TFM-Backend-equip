const express = require("express");
const router = express.Router();


/* API routes */
router.use("/user", require('./userRoutes'));


module.exports = router;