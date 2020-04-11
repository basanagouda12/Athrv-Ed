//Check if the user already exisits or not
const pool = require('../utils/db-config1');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
console.log('inside user model');
async function signup(req, res) {
	let { email, password } = req.body;
	let emailData = await pool.query('select email from auth where email = $1', [
		email
	]);
	if (emailData.rowCount !== 0) {
		return Promise.resolve({
			status: false,
			error: {
				type: 'email',
				message: 'User Email Already exisits'
			}
		});
	} else {
		//Encrpyt pass before Insertion
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		//Insert the pass and email
		let rowsInserted = await pool.query(
			'INSERT INTO auth values($1,$2,$3) returning email,category',
			[email, hash, 'U']
		);
		console.log(rowsInserted.rows);
		const user_id = await pool.query(
			'INSERT INTO profile(email) values($1) returning user_id',
			[email]
		);
		if (!rowsInserted.rowCount)
			return Promise.resolve({
				status: false,
				error: {
					type: 'server',
					message: 'Row not inserted '
				}
			});
		console.log(rowsInserted.rows[0].type);
		//DB installed successfully and token is genrated for further use
		let token = await jwt.sign(
			{
				user_id: user_id.rows[0].user_id,
				type: rowsInserted.rows[0].category
			},
			'secret',
			{
				expiresIn: '6h'
			}
		);
		return Promise.resolve({
			status: true,
			token: token
		});
	}
}

async function login(req, res) {
	let { email, password } = req.body;
	let emailData = await pool.query('select * from auth where email = $1', [
		email
	]);
	console.log(emailData.rows[0]);
	if (emailData.rowCount === 0) {
		return Promise.resolve({
			status: false,
			error: {
				type: 'Invalid Credentials', //User doesn't exisit
				message: 'Invalid Credentials '
			}
		});
	} else {
		const type = emailData.rows[0].category;
		//Encrpyt pass before Insertion
		const hash = emailData.rows[0].password; //Change this 	back to hash at localhost and password in git
		const passCheck = await bcrypt.compare(password, hash);

		if (!passCheck) {
			return Promise.resolve({
				status: false,
				error: {
					type: 'Invalid Credentials', //Invalid password
					message: 'User NAME or Password not correct'
				}
			});
		}

		let userData = await pool.query(
			'select user_id from profile where email = $1 ',
			[email]
		);

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

		// DB installed successfully and token is genrated for further use
		let token = await jwt.sign(
			{
				user_id: uuid,
				type: type
			},
			'secret',
			{
				expiresIn: '6h'
			}
		);
		userData.rows[0].token = token;
		userData.rows[0].type = type;
		console.log(userData.rows[0].type, ' here in type');
		return Promise.resolve({
			status: true,
			userData: userData.rows[0]
		});
	}
}

module.exports.signUp = signup;
module.exports.login = login;
