const express=require('express');
const router=express.Router();
const modifyleave=require('../../model/leavereqModel/modifyleave');
const auth = require('../../Auth/auth');
router.post("/", async (req,res) => {
    try{
        await auth(req,res);
        let { user , StartDate, EndDate,reason, adminmail }=req.body;
        var uuid= user
        let isInserted=await modifyleave.insertLeave(
                uuid,
                StartDate,
                EndDate,
                reason,
                adminmail
        ) ; 
        res.json(isInserted)
    }catch(error){
        console.log(error);
    }
})



module.exports=router;