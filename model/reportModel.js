const pool = require("../utils/db-config1");
const team = require("./Team");
const TaskMongo=require('./TaskModel/taskInsert')
const TaskViewMongo = require('./TaskModel/taskView')
const Calendar=require('./CalenderModel/insertCalendar')
const TaskupdateMongo = require('./TaskModel/taskUpdate')
async function* taskInsertion(users) {
  for (let user of users) {
    let task = await pool.query(
      "insert into task(reportid,user_id,task_description,category,assignedby,dependency) values($1,$2,$3,$4,$5,$6) returning *",
      [
        user.reportId,
        user.user_id,
        user.task_description,
        user.category,
        user.assignedby,
        user.dependency
      ]
    ); 
    try{
      let isInserted= await TaskMongo.insertTask(
      user.user_id,
      user.StartDate,
      user.EndDate,
      user.task_description)
      
      if(isInserted){
      let valInfo = await Calendar.insertCalendar(user.user_id,user.StartDate,user.EndDate,user.task_description )
      console.log(valInfo,"is the inserted calender")
      console.log("\n inserted rows ", task.rows);
    }
  }
    catch(err){
      console.log(err)
    }
    yield task.rows[0];
}
}

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

module.exports.UpdateTask = async (req, res) => {
  let {
    reportId,
    userId,
    startStatus,
    startTime,
    endStatus,
    endTime,
    progress,
    knowledegeGained,
    newSkills
  } = req.body;

  const isInserted = await pool.query(
    "update task set status_sod=$1,stime=$2,status_eod=$3,etime=$4,progress=$5,knowledge_gained=$6,new_skills_acquired=$7 where reportid=$8 and user_id=$9 returning *",
    [
      startStatus,
      startTime,
      endStatus,
      endTime,
      progress,
      knowledegeGained,
      newSkills,
      reportId,
      userId
    ]
  );
   await TaskupdateMongo.updateTask(userId , Date.now(), endStatus) //Here i am update the task according to the new status 
  console.log(isInserted.rows[0]);
  return res.json(isInserted.rows[0]);
};

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
module.exports.getActivities = async (req, res) => {
  let { work, title } = req.body;
  //console.log(user_id);
  const activities = await pool.query(
    "select  distinct a.activityid, d.title , a.activity_type , a.title as activity_title ,a.milestone, a.suid , a.description , a.isCompleted from domain d , activity a, activity_team t where a.activityid=t.activityid and a.domainid=d.domainid and (a.title = $1 or d.title = $3) and a.iscompleted = $2 ",
    [title, "f", work]
  );
  console.log(activities.rows);
  try {
    activities.rows = await team.teamMembers(req, res, activities.rows);
  } catch {
    return res.status(403).json({
      type: "server",
      error: "server error"
    });
  }
  console.log(activities.rows);
  return res.json(activities.rows);
};

// no more per day tasks from now on,
// filtering is done on the frontend,
// pagination will be implemented from the future
module.exports.GetTodaysTasks = async (req, res) => {
  let { activityid } = req.params;
  const tasks = await pool.query(
    `select report.milestone,report.date,task.reportid,fname,lname,task.user_id as user_id,
	status_sod, stime ,status_eod, etime ,progress,comment , task_description ,
	category,assignedby,dependency, knowledge_gained ,
	new_skills_acquired from task,profile,report,activity 
	where task.user_id=profile.user_id and report.reportid=task.reportid
	and activity.activityid=report.activityid and activity.activityid=$1`,
    [activityid]
  );
  tasks.rows.map(ele => {
    var taskMongo = TaskViewMongo.GetTask(ele.user_id);
    ele.dateInfo = taskMongo
    return ele
  })
  return res.json(tasks.rows);
};
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
module.exports.deleteTask = async (req, res) => {
  try {
    let { reportid } = req.params;
    let user = req.body.user;
    const deleteVal = await pool.query(
      "delete from task where reportid=$1 and user_id=$2",
      [reportid, user]
    );
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
module.exports.ActivityReports = async (req, res) => {
  try {
    let user = req.params.user_id;
    let activityid = req.params.activityid;
    const tasks = await pool.query(
      " select report.milestone,task.reportid,fname,lname,task.user_id as user_id,status_sod, stime ,status_eod, etime ,progress,comment , task_description ,category,assignedby,dependency, knowledge_gained , new_skills_acquired from task,profile,report,activity where task.user_id=profile.user_id and report.reportid=task.reportid and activity.activityid=report.activityid and task.user_id=$1 and activity.activityid=$2",
      [user, activityid]
    );
    return res.json(tasks.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      type: "server",
      error: "server error"
    });
  }
};
