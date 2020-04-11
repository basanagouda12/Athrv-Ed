const Calendar=require('../Schema/calSchema')

module.exports.findDates=async function(uuid){
    try{
        return await Calendar.findOne({uuid:uuid})
    }
    catch(err)
    {
        throw new Error(err)
    }

}