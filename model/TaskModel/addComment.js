const pool = require("../utils/db-config1");

module.exports.comments = async (req, res) => {
    try {
      let { reportid } = req.params;
      let user_id = req.body.user_id;
      let comment = req.body.comment;
      console.log(user_id, reportid, comment);
      const tasks = await pool.query(
        "update task set comment=$1 where user_id=$2 and reportid=$3 returning * ",
        [comment, user_id, reportid]
      );
      console.log(tasks.rowCount);
  
      return res.json({
        details: tasks.rows[0]
      });
    } catch (error) {
      console.log(error);
    }
  };