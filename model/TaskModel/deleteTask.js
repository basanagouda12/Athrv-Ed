const pool = require("../utils/db-config1");

// currently all the tasks for the given report and given user , modified to delete task for the given date
module.exports.deleteTask = async (req, res) => {
  try {
    let { reportid, reportDate } = req.params;
    let user = req.body.user;
    const deleteVal = await pool.query(
      "delete from task where reportid in (select reportid from report where reportid=$1 and date=$2) and user_id=$3",
      [reportid, date, user]
    );

    // successful is returned regardless of whether deletion succeeds or fails, please research and fix it
    return res.json({
      type: "successful"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      type: "server",
      error: "server error"
    });
  }
};
