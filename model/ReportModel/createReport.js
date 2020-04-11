
const pool = require("../../utils/db-config1");
const taskInsertion = require('../TaskModel/taskInsert').taskInsertion
const TaskMongo=require('../TaskModel/taskInsert')

const Calendar=require('../CalenderModel/insertCalendar')



module.exports.Insert = async (req, res) => {
    console.log(req.body);
    let { milestone, activityid, user_id } = req.body;
    let super_id = req.body.user;
    const date = new Date();
    const isInserted = await pool.query(
      "insert into report (reportid,milestone,activityid,date) values (default,$1,$2,$3) returning reportId",
      [milestone, activityid, date  ]
    );
    console.log(user_id, "is user id");
    console.log(req.body,"is the req body");
    let { reportid } = isInserted.rows[0];
    console.log(reportid, "is report id  ");
    user_id = user_id.map(user => {
      user.reportId = reportid;
      user.assignedby = super_id;
      console.log("\n User ", user);
      return user;
    });
  
    isInserted.rows[0].tasks = [];
    for await (let i of taskInsertion(user_id)) {
      isInserted.rows[0].tasks.push(i);
    }
    console.log(isInserted.rows[0]);
    return res.json(isInserted.rows[0]);
  };