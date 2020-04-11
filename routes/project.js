const express = require('express');
const router = express.Router();
const auth = require('../Auth/auth');
const dbconfig = require('../utils/db-config1');
function genrator(ele) {
	return {
		milestone: ele.milestone,
		reportid: ele.reportid,
		fname: ele.fname,
		lname: ele.lname,
		user_id: ele.user_id,
		status_sod: ele.status_sod,
		stime: ele.stime,
		status_eod: ele.status_eod,
		etime: ele.etime,
		progress: ele.progress,
		comment: ele.comment,
		task_description: ele.task_description,
		category: ele.category,
		assignedby: ele.assignedby,
		dependency: ele.dependency,
		knowledge_gained: ele.knowledge_gained,
		new_skills_acquired: ele.new_skills_acquired
	};
}
router.get('/task/:projectid', async (req, res) => {
	try {
		const check = auth(req, res);
		var projectid = req.params.projectid;
		const query = await dbconfig.query(
			'select report.milestone,task.reportid,fname,lname,task.user_id as user_id,status_sod, stime ,status_eod, etime ,progress,comment , task_description ,category,assignedby,dependency, knowledge_gained , new_skills_acquired from task,profile,report where task.user_id=profile.user_id and report.reportid=task.reportid and  report.reportid in (select reportid from report where activityid =$1)',
			[projectid]
		);
		var arrTask = [];
		for (i = 0; i < query.rowCount; i++) {
			arrTask.push(genrator(query.rows[i]));
		}

		console.log(arrTask);
		return res.json(arrTask);
	} catch (error) {
		console.log(error);
		res.status.json([
			{
				type: 'server',
				error: 'Server error'
			}
		]);
	}
});
router.get('/task/')
module.exports = router;
/*select report.milestone,task.reportid,fname,lname,task.user_id as user_id,status_sod, stime ,status_eod, etime ,progress,comment , task_description ,category,assignedby,dependency, knowledge_gained , new_skills_acquired from task,profile,report,activity where task.user_id=profile.user_id and report.reportid=task.reportid and activity.activityid=report.activityid and report.date=$1 and activity.activityid=$2'*/
