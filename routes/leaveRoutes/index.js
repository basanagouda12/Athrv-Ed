const leaveinsert = require('./leaveinsert');
const adminUpdate = require('./AdminUpdate');
const AllLeaves = require('./viewLeaves');
const express = require('express');
const router = express.Router();
router.use("/insert",leaveinsert);
router.use("/adminUpdate",adminUpdate);
router.use('/view',AllLeaves)
module.exports = router;

