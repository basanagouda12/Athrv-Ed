//All the require files from module
const express = require('express');
const router = express.Router();
const ValidCred = require('../utils/ValidateForm');
const userModel = require('../model/userModel');


// Route directed for the signup
router.post('/login', async (req, res) => {
	try {
		let { email, password } = req.body;
		let cpassword = password;

		//Validation of the credentials

		const isValidated = ValidCred(email, password, cpassword);
		console.log(isValidated);
		if (!isValidated.status) {
			return res.status(401).json(isValidated.errors);
		}
		console.log('1');
		//	LoginData ;
		const validationInfo = await userModel.login(req, res);
		if (!validationInfo.status) {
			return res.status(403).json([validationInfo.error]);
		}

		const { userData } = validationInfo;
		req.header.token = userData.token;
		//res.redirect('/profile');
		req.body.user = userData.user_id;
		return res.json(userData);
	} catch (err) {
		console.log(err);
		console.log('3');
		return res.status(500).json([{ type: 'server', message: 'Server error' }]);
	}
});
module.exports = router;
