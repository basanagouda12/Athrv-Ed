const Calendar=require('../Schema/calSchema')


module.exports.fileUpload=async function(source)
{

    try{

    let    current=new Date()
    let previous=new Date(current.getDate()-1)
    
    

        source.forEach(async (ele)=>{

            let insert = await Calendar.updateMany(
                {uuid:ele.emp_id,$and:[{"dates.date": {$gt:previous }},
                {"dates.date": {$lt: current}}]},
                {$set:{"dates.$.hrs":ele.WorkingHours}}
            )
            console.log(Date())
             console.log(insert)

        })
        return "Successfully inserted"
    }

    catch(err){
        throw new Error(err)
    }
}