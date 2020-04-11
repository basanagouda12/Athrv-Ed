const mongoose=require("../../utils/mongoose-db");

const LeaveSchema=mongoose.Schema([{
uuid:String,
CurrentDate:{
    type : Date,
    default : Date.now()
},
StartDate:Date,
EndDate:Date,
reason:String,
adminmail:String,
status:{
    type:String,
    default : "Pending"
}
}]);

module.exports=mongoose.model("leaves",LeaveSchema);
