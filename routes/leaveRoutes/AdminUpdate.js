const express=require('express');
const router=express.Router();
const modifyleave = require('../../model/leavereqModel/modifyleave');
const adminAuth = require('../../Auth/adminAuth');
router.post("/", async (req,res) => {
    try{
        await adminAuth(req,res);
        let { uuid,CurrentDate,adminmail,EndDate,StartDate,status }=req.body;
        let adminUpdated=await modifyleave.AdminUpdate(
            uuid,
            CurrentDate,
            StartDate,
            EndDate,
            adminmail,
            status
        ) ;
        res.json(adminUpdated)
        console.log(adminUpdated)
    }catch(error){
        console.log(error);
    }
})



module.exports=router;