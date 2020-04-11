const pool = require("../../utils/db-config1");
const team = require("../Team");
module.exports.SuperActivities = async (req, res) => {
    let user_id = req.body.user;
    console.log(user_id);
    const activities = await pool.query(
      "select a.activityid , d.title as work, a.activity_type , a.title as activity_title , a.suid , t.user_id , a.description , a.isCompleted from domain d , activity a, activity_team t where a.activityid=t.activityid and a.domainid=d.domainid and user_id = $1 and a.iscompleted = $2",
      [user_id, "f"]
    );
    console.log(activities.rows[0], "super");
    return activities.rows;
  };
  
  //incomplete user Actvities 
  module.exports.userActivities = async (req, res) => {
    let user_id = req.body.user;
    console.log(user_id);
    const activities = await pool.query(
      "select a.activityid , d.title , a.activity_type , a.title as activity_title , a.suid , t.user_id , a.description , a.isCompleted from domain d , activity a, activity_team t where a.activityid=t.activityid and a.domainid=d.domainid and user_id = $1 and a.iscompleted = $2",
      [user_id, "f"]
    );
    try {
      activities.rows = await team.teamMembers(req, res, activities.rows);
    } catch {
      return res.status(403).json({
        type: "server",
        error: "server error"
      });
    }
    console.log(activities.rows, "user");
    return res.json(activities.rows);
  };