const express=require('express');
const router=express.Router();
const Calendar=require('../../model/CalenderModel/viewCalendar');
const auth = require('../../Auth/auth');
/*
Author : Varsha G 
Task : Insert route for the Calender Schema 
Requirments : {
    StartDate :
    EndDate :
    Task : 
    status  : 
} 
*/
router.get('/',async (req,res)=>{
    await auth(req,res);
    try{
        let { user } = req.body
        let info = await Calendar.findDates(user) // Route used to find all the tasks for that specific 
        if(info){
        let dates = []
        for (let i in info.dates)
        {
            let  doc = {
                date:info.dates[i].date,
                total:info.dates[i].hrs * 3600,
                details:[]
            }
            dates.push(doc)   
        }
        console.log(dates)
        return res.status(200).json(dates)
    }
    else{
        return res.json({msg:`No data entries found for ${uuid}` })
    }
    }
    catch(err){
        res.json({message:"there is an error"+err})
    }
})


module.exports=router