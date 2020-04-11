const Task=require('../Schema/taskSchema')
const pool = require("../../utils/db-config1");
const TaskupdateMongo = require('../TaskModel/taskUpdate')

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
  

module.exports.updateTask=async function(uuid,created,status)
{
    try{

        console.log(typeof created)
         return await Task.update(
                    { uuid:uuid,
                        "tasks.created":new Date(created)
                    },
                    {
                        $set:
                        {"tasks.$.status":status}
                    } 
        )


    }
    catch(err){
        throw new Error(err)
    }
    }
