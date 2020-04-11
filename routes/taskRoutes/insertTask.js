/*
Author: Varsha  G D
Created: 22/02/2020
Task: insert task information. tihs is a route file. inserts into both task and calendar collection
*/



const express=require('express')``

const router=express.Router()

const Task=require('../model/TaskModel/taskInsert')
const auth = require('../../Auth/auth')
const Calendar=require('../../model/CalenderModel/insertCalendar')


router.post('/',async (req,res)=>{

try{
await auth(req,res);
let { user,StartDate,EndDate,task} =req.body
var uuid = user;
let isInserted= await Task.insertTask(
    uuid,
    StartDate,
    EndDate,
    task)

if(isInserted){
    let inserted = await Calendar.insertCalendar(uuid,StartDate,EndDate,task)
    if(inserted){
        console.log(isInserted)
         res.status(200).json(isInserted)
    }
}
}
catch(error){
        console.log(error)
        res.status(400).json({msg:error})
    }
})

module.exports=router