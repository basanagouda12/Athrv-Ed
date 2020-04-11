/*
Author: Varsha G D
created: 22/02/2020
Task: once information is inserted into task , information about all the dates for a particular task is updated in the calendar
collection. no of hrs is set to 0 from all those dates and later assigned using a the Attendance module.
 (route: /task/insert )
*/

const Calendar=require('../Schema/calSchema')

module.exports.insertCalendar=async function(uuid,StartDate,EndDate,task){
    console.log(uuid,StartDate , EndDate , task)
try{
    let start=new Date(StartDate)
    let end=new Date(EndDate)
    let  find = await Calendar.findOne({uuid : uuid})
    
    if(find){
    for(let d=start;d<=end;d.setDate(d.getDate()+1))
    {
        console.log('here in loop ')
        let info= await Calendar.findOneAndUpdate(
                        {
                            uuid:uuid
                        },  //Find it based on uuid the calender of the student 
                        {
                        $push:
                        {     dates: {
                                    date:d,
                                    hrs:0,
                                    task:task,  
                                    status:"T"}
                        }},
                        {new:true})}}
        else {
            let doc = {
                uuid:uuid,
                dates:[]
            }
            console.log('I am here')
           await Calendar.create(doc);
            return await this.insertCalendar(uuid , StartDate, EndDate , task)
        }
            
    }



catch(err){
    throw new Error(err)
}



}
