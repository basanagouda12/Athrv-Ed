const pool = require('../utils/db-config1');
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
		console.log('\n\n');
		if (rowsInserted.rowCount === 0) {
			console.log('Check log');
			return Promise.resolve({
				status: false,
				error: [{ type: 'server', message: 'Server error' }]
			});
		}
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
		let rowInserted = await pool.query(
			'insert into skillset values ($1,$2,$3)',
			[user, title, skills]
		);
		if (rowsInserted.rowCount === 0) {
			console.log('Chack log');
			return Promise.resolve({
				status: false,
				error: [{ type: 'server', message: 'Servor error ' }]
			});
		}
		return Promise.resolve({ status: true, profileData: rowsInserted.rows[0] });
	} catch (err) {
		console.log(err, 'inside skills set error');
	}
}

module.exports.userdetails = userdetails;
