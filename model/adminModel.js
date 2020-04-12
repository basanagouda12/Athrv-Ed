const pool = require('../utils/db-config2');

module.exports.getAll = async (req, res) => {
	const AllProfiles = await pool.query(
		'select user_id,email,lname,fname from profile '
	);
	console.log(AllProfiles.rows);
	if (AllProfiles.rowCount === 0) {
		//	console.log('I am here');
		return res.status(401).json({
			error: [{
				type: 'server',
				error: 'Server Error'
			}]
		});
	}

	res.status(200).json({
		allUsers: AllProfiles.rows
	});
};
module.exports.setActivity = async (req, res) => {
	let {
		work,
		title,
		user_id,
		super_id,
		activity_type
	} = req.body;
	//to select the domain set by the admin when selecting the team
	const domaidQuery = await pool.query(
		'select (domainid) from domain where title = $1',
		[work]
	);
	if (domaidQuery.rowCount == 0) {
		return res.send({
			error: {
				error: [{
					type: 'error',
					error: "Field of work doesn't match"
				}]
			},
			status: false
		});
	}

	const domainid = domaidQuery.rows[0].domainid;
	//Lets just create the domains and not assign the supervisor so that when we need to we can alter the table for the supervisor and go back and forth with that
	const updateSuper = await pool.query(
		'update domain set super_id = $1 where domainid = $2',
		[super_id, domainid]
	);
	const changeType = await pool.query(
		'update auth set category=$1 where email = (select email from profile where user_id=$2)',
		['S', super_id]
	);
	if (domaidQuery.rowCount === 0) {
		return res.status(401).json({
			error: [{
				type: 'Server',
				error: 'Server Error'
			}]
		});
	}
	const insertActivity = await pool.query(
		'insert into activity (domainid,title,suid,iscompleted,activity_type) values ($1,$2,$3,$4,$5) returning activityid',
		[domainid, title, super_id, 'f', activity_type]
	);
	if (insertActivity.rowCount === 0) {
		return res.status(401).json({
			error: [{
				type: 'server',
				error: 'Server Error'
			}]
		});
	}
	const activityid = insertActivity.rows[0].activityid;

	const Arr = user_id.forEach(async element => {
		const insertUser = await pool.query(
			'insert into activity_team values ($1,$2)',
			[activityid, element]
		);
		if (insertUser.rowCount === 0) {
			return res.status(401).json({
				error: [{
					type: 'server',
					error: 'Server Error'
				}]
			});
		}
	});
	return res.status(200).json({
		activityid,
		title,
		super_id,
		work,
		activity_type,
		user_id
	});
};

module.exports.getIncomplete = async (req, res) => {
	const incomplete_activity = await pool.query(
		'select a.activityid,a.title as activity_title,a.suid,a.activity_type,a.description,d.title as work from activity a, domain d where iscompleted=$1 and d.domainid=a.domainid',
		['f']
	);

	if (incomplete_activity.rowCount === 0) {
		return res.status(401).json({
			error: [{
				type: 'server',
				error: 'Server Error'
			}]
		});
	}
	console.log(incomplete_activity.rows);
	return res.json({
		incompleteActivity: incomplete_activity.rows
	});
};