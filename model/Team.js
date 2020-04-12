const pool = require('../utils/db-config2');
module.exports.teamMembers = async (req, res, activities) => {
	let returnActivities = [];
	for (let activity of activities) {
		const users = await pool.query(
			' select fname,lname,user_id from profile where user_id in (select user_id from activity_team where activityid=$1)',
			[activity.activityid]
		);
		activity.team = users.rows;
		returnActivities.push(activity);
	}

	return returnActivities;
};
