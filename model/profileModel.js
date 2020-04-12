const pool = require('../utils/db-config2');
console.log('inside update profile');
async function userdetails(req, res) {
	let {
		fname,
		lname,
		sex,
		phone,
		sem,
		branch,
		aboutme,
		address_line1,
		address_line2,
		city,
		dist,
		state,
		pin,
		dob,
		user
	} = req.body;

	let address_line = address_line1 + ' ' + address_line2;
	console.log(address_line);
	try {
		console.log(user);
		let rowsInserted = await pool.query(
			'update  profile set  fname = $1,lname =$2,sex =$3,phone=$4,sem=$5,branch=$6,aboutme=$7,address_line1=$8,address_line2=$9 ,city=$10,dist=$11,state=$12,pin=$13,dob=$14 where user_id = $15 returning email,fname,lname,sex,phone,sem,branch,aboutme,address_line1,address_line2,city,dist,state,pin ',
			[
				fname,
				lname,
				sex,
				phone,
				sem,
				branch,
				aboutme,
				address_line1,
				address_line2,
				city,
				dist,
				state,
				pin,
				dob,
				user
			]
		);

		console.log(
			fname,
			lname,
			sex,
			phone,
			sem,
			branch,
			aboutme,
			address_line1,
			address_line2,
			city,
			dist,
			state,
			pin,
			dob,
			user
		);
		console.log('Row Inserted are  : ', rowsInserted.rowCount);
		//	console.log(rowsInserted);
		//console.log('\n\n');
		if (rowsInserted.rowCount === 0) {
			console.log('Check log');
			return Promise.resolve({
				status: false,
				error: [{ type: 'server', message: 'Row not inserted ' }]
			});
		}
		rowsInserted.rows[0].type = req.body.type;
		//DB installed successfully and token is genrated for further use
		return Promise.resolve({
			status: true,
			userData: rowsInserted.rows[0]
		});
	} catch (err) {
		console.log(err, 'inside updateProfile');
	}
}

async function skills(req, res) {
	let { title, skills, user } = req.body;

	try {
		let rowExist = await pool.query(
			'select * from skillset where user_id = $1 and title = $2 and skills = $3',
			[user, title, skills]
		);

		if (rowExist.rowCount === 0) {
			let rowsInserted = await pool.query(
				'insert into skillset values ($1,$2,$3) returning user_id,title,skills;',
				[user, title, skills]
			);
			if (rowsInserted.rowCount === 0) {
				console.log('Check log at Profile Model');
				return Promise.resolve({
					status: false,
					error: [{ type: 'server', message: 'Server Error ' }]
				});
			}
			console.log(rowsInserted.rows[0]);
			return Promise.resolve({ status: true, skillInfo: rowsInserted.rows[0] });
		} else {
			console.log('here ');
			const previousSkill = rowExist.rows[0].skills;
			let rowsInserted = await pool.query(
				'update skillset set title=$2 ,skills=$3 where user_id = $1 and title = $4 returning user_id,title,skills;',
				[user, title, skills, title]
			);
			if (rowsInserted.rowCount === 0) {
				console.log('Check log at Profile Model');
				return Promise.resolve({
					status: false,
					error: { type: 'server', message: 'Server Error ' }
				});
			}
			console.log(rowsInserted.rows[0]);
			return Promise.resolve({ status: true, skillInfo: rowsInserted.rows[0] });
		}
	} catch (err) {
		console.log(err, 'inside skills set error');
		return Promise.resolve({
			status: false,
			error: { type: 'server', message: 'Server Error ' }
		});
	}
}
async function getProfile(req, res) {
	let userData = await pool.query('select * from profile where user_id = $1', [
		req.body.user
	]);

	if (userData.rowCount === 0) {
		return Promise.resolve({
			status: false,
			error: {
				type: 'Invalid Credentials', //Invalid password
				message: "The Profile Doesn't Exisits "
			}
		});
	}

	const uuid = userData.rows[0].user_id;
	const domainid = userData.rows[0].domainid;

	let DomainInfo = await pool.query(
		'select * from domain where domainid = $1',
		[domainid]
	);
	let skills, domain;
	//SKill set Info being provided to the backend
	let Skillset = await pool.query('select * from skillset where user_id = $1', [
		uuid
	]);

	if (DomainInfo.rowCount === 0) {
		domain = {};
	} else {
		domain = DomainInfo.rows[0];
	}

	if (Skillset.rowCount === 0) {
		skills = {};
	}

	skills = Skillset.rows.map(val => {
		skillInfo = {};
		skillInfo.title = val.title;
		skillInfo.skills = val.skills;
		return skillInfo;
	});

	if (userData.rowCount === 0) {
		console.log('Check log');
		return Promise.resolve({
			status: false,
			error: { type: 'row/edit/profile', message: 'Row not inserted ' }
		});
	}
	userData.rows[0].skills = skills;
	userData.rows[0].domain = domain;
	return Promise.resolve({
		status: true,
		userData: userData.rows[0]
	});
}
async function setQualifications(req, res) {
	let { board, college, grade, qualification, user } = req.body;
	let getEducation = await pool.query(
		'select * from education where user_id = $1 and qualification = $2',
		[req.body.user, req.body.qualification]
	);
	if (
		board != null &&
		college != null &&
		grade != null &&
		qualification != null
	) {
		console.log('inside the !null for board and colleega ');
		if (getEducation.rowCount === 0) {
			console.log('if the row is counted zero for all the qualifiaction given');
			let allQualification = await pool.query(
				'insert into education values($1,$2,$3,$4,$5);',
				[user, qualification, board, college, grade]
			);
			if (allQualification.rowCount === 0) {
				return Promise.resolve({
					status: false,
					error: {
						type: 'server', //Invalid password
						message: 'server error '
					}
				});
			}
		} else {
			console.log(
				'if the row is counted non zero for all the qualifiaction given'
			);
			let allQualification = await pool.query(
				'update education set   board= $3, college= $4, grade= $5 where user_id = $1 and qualification = $2',
				[user, qualification, board, college, grade]
			);
			if (allQualification.rowCount === 0) {
				return Promise.resolve({
					status: false,
					error: {
						type: 'server', //Invalid password
						message: 'Server error '
					}
				});
			}
		}
	}
	console.log('outside the null board and qualification');
	let getEducationArr = await pool.query(
		'select * from education where user_id = $1 ',
		[req.body.user]
	);
	console.log(
		getEducationArr.rowCount,
		'is the number of rows returns and uuid = ',
		req.body.user
	);
	qualificationInfo = getEducationArr.rows.map(val => {
		qualification = {};
		qualification.qualification = val.qualification;
		qualification.board = val.board;
		qualification.college = val.college;
		qualification.grade = val.grade;
		return qualification;
	});

	return Promise.resolve({
		status: true,
		qualification: { qualification: qualificationInfo }
	});
}
module.exports.userdetails = userdetails;
module.exports.skills = skills;
module.exports.getProfile = getProfile;
module.exports.setQualifications = setQualifications;
