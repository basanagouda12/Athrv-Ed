
const express=require('express')
const router= express.Router()
const multer = require('multer')
const csvtojson=require('csvtojson')
const csvInsertion=require('../model/CalenderModel/csvInsertion')




let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, 'attendance')
    }
  })
  
        

const upload = multer({ storage: storage })

router.post('/uploadfile', upload.single('myFile'),async (req, res, next) => {

    try{
        const file = req.file

    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
      
      csvtojson().fromFile('./uploads/attendance').
      then(async (source) =>
        {
            //console.log(source);
            console.log(source);
            let isInserted=await csvInsertion.fileUpload(source)
            if(isInserted)
            {
                res.json({msg:isInserted})
            }
        })
    }
    catch(err){
        res.json({msg:"Unable to insert "+err})

    }

    })


    module.exports = router
