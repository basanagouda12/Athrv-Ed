const Task=require('../Schema/taskSchema')
const pool = require("../../utils/db-config1");
const TaskViewMongo = require('../TaskModel/taskView')

//This is to get all the task for a given activity id , ie give the whole team reports 
module.exports.GetTask = async (req, res) => {
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
      var taskMongo = TaskViewMongo(ele.user_id);
      ele.dateInfo = taskMongo
      return ele
    })
    return res.json(tasks.rows);
  };
//This is to view all the task that are in the mongo db folder
module.exports.viewTasks=async function(uuid){
    let info=[]
try{
        if(uuid==null){ 
            Value= await Task.find()
        }   
        else{
            Value=await Task.find({uuid:uuid}) 
        }
    if(Value){
        Value.forEach((ele=>{
            ele.tasks.forEach(element=>{
                let doc={
                    uuid:ele.uuid,
                    task:element
                }
                if(doc.task.status=="Ongoing")
                 {
                    info.push(doc)
                 }
            })
        }))
        return info;
    }
}
catch(err){
        console.log(err)
}}

//This is to show the task for perticular uuid and activity id 
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
  

