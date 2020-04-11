const viewCalender = require('./viewCalendar');
const express= require('express')
const router = express.Router();
router.use("/info",viewCalender);
module.exports = router;
