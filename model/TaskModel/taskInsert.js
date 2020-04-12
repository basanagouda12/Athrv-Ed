/*
Author: Varsha G D
created: 22/02/2020
Task: insert information into task along with start date ,end date and status
 (route: taskInsert.js)
*/
const TaskMongo = require("../TaskModel/taskInsert");

// you forgot to import the below pool varsha!
const pool = require("../../utils/db-config2");
const Calendar = require("../CalenderModel/insertCalendar");
//ASync Function to insert task

module.exports.taskInsertion = async function* taskInsertion(users) {
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
    try {
      let isInserted = await TaskMongo.insertTask(
        user.user_id,
        user.StartDate,
        user.EndDate,
        user.task_description
      );

      if (isInserted) {
        let valInfo = await Calendar.insertCalendar(
          user.user_id,
          user.StartDate,
          user.EndDate,
          user.task_description
        );
        console.log(valInfo, "is the inserted calender");
        console.log("\n inserted rows ", task.rows);
      }
    } catch (err) {
      console.log(err);
    }
    yield task.rows[0];
  }
};
//Mongo Task insertion
const Task = require("../Schema/taskSchema");
module.exports.insertTaskMongo = async function(
  uuid,
  StartDate,
  EndDate,
  task
) {
  try {
    let userid = await Task.findOne({ uuid: uuid });

    if (!userid) {
      let doc = {
        uuid: uuid,
        tasks: [
          {
            task: task,
            StartDate: StartDate,
            EndDate: EndDate
          }
        ]
      };
      return await Task.create(doc);
    } else {
      return await Task.update(
        { uuid: uuid },
        {
          $push: {
            tasks: {
              task: task,
              StartDate: StartDate,
              EndDate: EndDate
            }
          }
        },
        {
          new: true,
          upsert: true
        }
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};
