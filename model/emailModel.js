const pool = require('../utils/db-config');

async function emailVerify(email) {
	console.log('Inside email model');
	let emailData = await pool.query(
		'select email from member1 where email = $1',
		[email]
	);

	if (emailData.rowCount === 0) {
		return Promise.resolve({
			status: false,
			error: {
				type: 'email',
				message:
					"This is not a verified user, Please contact the Athrev Personal's near you "
			}
		});
	} else {
		return Promise.resolve({
			status: true,
			error: null
		});
	}
}
module.exports.emailVerify = emailVerify;
