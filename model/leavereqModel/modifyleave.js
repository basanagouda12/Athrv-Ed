/*
Author : Sushmitha 
Task : Update the Leave Schema in the insert Leave and Admin update requires the uuid and the startdate of the leave to search the file 
*/ 
var mongoose=require('mongoose');
const Leave=require('../Schema/leaveSchema');
const Calendar = require('../Schema/calSchema');
const insertCalender = require('../CalenderModel/insertCalendar')
module.exports.insertLeave=async function(  //insert the leave in the leave schema and wait for the acception from the admin 
    uuid,
    StartDate,
    EndDate,
    reason,
    adminmail) {
    try{
        return await Leave.create({
            uuid,
            StartDate,
            EndDate,
            reason,
            adminmail
        });
    }catch(error){
        throw new Error(error);
    }
    
    };

    module.exports.AdminUpdate = async function( //request the leave from admin to see if it is accepted or rejected and insert it into the calender Schema 
        uuid,
        CurrentDate,
        StartDate,
        EndDate,
        adminmail,
        status
      ) {
        try {
           const info = await Leave.findOneAndUpdate(
            { uuid:uuid,
              StartDate:StartDate},
            {
              status:status
            },
            { new:true , useFindAndModify : true}
           
          );
      if(status='Accepted'){
         await insertCalender.insertCalendar(uuid , StartDate , EndDate , "Leave" )
      } 
      return info;
      } catch (error) {
          throw new Error(error);
        }
      };  