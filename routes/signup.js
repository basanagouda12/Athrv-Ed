//All the require files from module
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const controller = require('../controllers/UserController');
const ValidCred = require('../utils/ValidateForm');
const emailModel = require('../model/emailModel');
const userModel = require('../model/userModel');
const profileModel = require('../model/profileModel');
const pool = require('../utils/db-config1');
const reportModel = require('../model/reportModel');

//Regex based checking for the email

// Route directed for the signup
router.post('/signup', async (req, res) => {
	console.log('inside sign up route');
	console.log('Inside controller - user ');
	try {
		let { email, password, cpassword } = req.body;

		//Validation of the credentials
		const isValidated = ValidCred(email, password, cpassword);
		if (!isValidated.status) {
			return res.status(401).json(isValidated.errors);
		}
		//	getEmailVerification;
		const isVerified = await emailModel.emailVerify(email);
		if (!isVerified.status) {
			return res.status(403).json([isVerified.error]);
		}
		//	InsertData;
		const isInserted = await userModel.signUp(req, res);
		if (!isInserted.status) {
			return res.status(403).json([isInserted.error]);
		}
		return res.json({
			token: isInserted.token
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json([
			{
				type: 'server',
				message: 'Server error'
			}
		]);
	}
});
module.exports = router;
