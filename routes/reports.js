const express = require("express");
const router = express.Router();
const userAuth = require("../Auth/auth");

const reportModel = require("../model/reportModel");
const createReport = require("../model/ReportModel/createReport");
router.post("/", async (req, res) => {
  try {
    await userAuth(req, res);
    console.log(req.body);
    await createReport.Insert(req, res);

    ///End codeing here at 7: 25
  } catch (err) {
    console.log(err);
    res.status(403).json({
      type: "server",
      error: "Server error"
    });
  }
});
router.get("/activity", async (req, res) => {
  try {
    await userAuth(req, res);
    reportModel.userActivities(req, res);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:activityid", async (req, res) => {
  try {
    await userAuth(req, res);
    // no more today's tasks all tasks are needed for the activity
    //Noted - No more Filtering the Tasks based on Day to Day Basis
    reportModel.GetTodaysTasks(req, res);
  } catch (err) {
    console.log(err);
  }
});

router.post("/task", async (req, res) => {
  try {
    await userAuth(req, res);
    reportModel.UpdateTask(req, res);
  } catch (err) {
    console.log(err);
  }
});
router.post("/:reportid/comment", async (req, res) => {
  try {
    await userAuth(req, res);
    reportModel.comments(req, res);
  } catch (error) {
    console.log(error);
  }
});
router.get("/activity/query", async (req, res) => {
  try {
    const isValid = userAuth(req, res);
    const val = reportModel.getActivities(req, res);
  } catch (err) {
    console.log(err);
  }
});
router.delete("/task/:reportid/date/:date", async (req, res) => {
  try {
    const isValid = await userAuth(req, res);
    const deletedValue = await reportModel.deleteTask(req, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      type: "server",
      error: "server error"
    });
  }
});
router.get("/activity/:activityid/user/:user_id", async (req, res) => {
  try {
    const isValid = await userAuth(req, res);
    await reportModel.ActivityReports(req, res);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      type: "server",
      error: "server error"
    });
  }
});
module.exports = router;

/* Select * from report r , task t where r.reportid = t.reportid and r.activityid = $1 and t.user_id=$2 */
