const pool =require('../utils/db-config1');
const parser=require('body-parser');
console.log('inside admin profile');


module.exports.admindetails= async function(
	firstname,
	lastname,
	email,
	sex,
	phone,
	aboutme,
	address_line1,
	address_line,
	city,
	dist,
	state,
	pin,
	dob,
	user_id){
    try {
        let rowInserted = await pool.query(
            "insert into profileAdmin(firstname,lastname,email,user_id,sex,aboutme,address_line1,city,dist,state,pin,dob,address_line,phone) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning *",
            [
				firstname,
				lastname,
				email,
				user_id,
				sex,
				aboutme,
				address_line1,
				city,
				dist,
				state,
				pin,
				dob,
				address_line,
				phone
            ]
        );
        /*console.log(
			firstname,
			lastname,
			sex,
			phone,
			aboutme,
			address_line1,
			address_line2,
			city,
			dist,
			state,
			pin,
			dob
		);*/
		console.log('Row Inserted are  : ', rowInserted.rowCount);
		//	console.log(rowsInserted);
		//console.log('\n\n');
		if (rowInserted.rowCount === 0) {
			return 0;
		}else{
			return 1;
		}

	} catch (err) {
		console.log(err, 'inside profileAdmin');
	}

	}



module.exports.getProfile=async function(firstname) {
	let userData = await pool.query('select * from profileAdmin where firstname=$1', [
		firstname

	]);

	if (userData.rowCount === 0) {
		return 'No data found';

	}else {
        return userData;
    }

}