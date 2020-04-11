const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const CalenderSchema=new Schema({
    uuid:{  
        type:String,
        unique:true
    },
    dates:
    [{ 
        date:
            {   
            type:Date,
            default:Date.now
            },
        hrs:Number,
        task:String,
        status:String
        }]
})


let cal=mongoose.model('calenders',CalenderSchema)
module.exports=cal