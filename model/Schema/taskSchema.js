const mongoose=require('mongoose')

const taskSchema=mongoose.Schema(
    {
        uuid:{
        type:String,
        unique:true
    },
    tasks:[{
            task:String,
            StartDate:Date,
            EndDate:Date,
            status:{
                type:String,
                default:"Ongoing"
            },
            created:{
                type:Date,
                default:Date.now
            }
        }]
    })


let task=mongoose.model('tasks',taskSchema)

module.exports=task 