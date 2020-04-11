/*
Author : Abhishek Dileep
Created  : 21/2/2020
Task : View  all Leave Requests ongoing for the Admin and User
This section of the Code is used to find all the Leave Applications that are either ongoing . The End Date is Compared with todays date and check in compareDate and a .then and .catch is used to 
call the compare function as a callback function on to the synthesised Data 
*/
const db = require('../Schema/leaveSchema');
var mongoose = require('mongoose') 
async function  AllLeaves (type,user){
    var info = [];
    try
    {
        let Value = {}
        console.log(type,user,'in the find leaves')
        if(type=='A'){ 
            Value = await this.pendingLeaves(type , user)
        }
        else{
            Value = await db.find({uuid:user})   
        }  
        Value.forEach(arr =>{
            
              if(arr.EndDate > Date.now() ){
                  info.push(arr)
                }
        }) //  Removed await and added .then and .catch {Their is an issue with the view of admin and user }
      return info;
    }
    catch(err){
        console.log(err)
    }

}

async function pendingLeaves (type,user){

    var info = [];
    try
    {
        let Value = {}
        console.log(type,user,'in the find leaves')
        if(type=='A'){ 
            Value = await db.find({status:"Pending"})}
        else{
            Value = await db.find({uuid:user})   
        }  
        Value.forEach(arr =>{
            
              if(arr.EndDate > Date.now() && arr.status == "Pending"){
                  info.push(arr)
                }
        }) //  Removed await and added .then and .catch {Their is an issue with the view of admin and user }
      return info;
    }
    catch(err){
        console.log(err)
    }
}
module.exports.AllLeaves = AllLeaves;
module.exports.pendingLeaves = pendingLeaves;