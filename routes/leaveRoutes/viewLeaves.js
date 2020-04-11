/*
Author : Abhishek 
Created : 21/2/2020
Task : View All Leave on-going . This is Route File. It Sorts the poeple based on User Type
*/
const express = require('express');
const Router = express.Router();
const auth = require('../../Auth/auth')
const findLeaves = require('../../model/leavereqModel/findLeaves');
Router.get("/", async (req,res) => {
    try{
        await auth(req,res)
        let { user,type }=req.body;
            console.log(type,user,' in All leaves ')
            const value = await findLeaves.AllLeaves(type,user)
           if(value)
            {res.json(value)}
    }catch(error){
        console.log(error);
    }
})
module.exports = Router;