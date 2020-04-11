const express = require('express');
const auth = require('../Auth/auth');
const adminAuth = require('../Auth/adminAuth');
const adminModel = require('../model/adminModel');
const router = express.Router();

router.get('/all', async (req, res) => {
	try {
		const isAuthenticated = await auth(req, res);
		if (req.body.type !== 'A') {
			//console.log(req.body.type);
			return res.status(403).json({
				type: 'email',
				error: 'Unauthorized Access'
			});
		}
		const AllProfiles = await adminModel.getAll(req, res);
	} catch (err) {
		console.log('inside the admin ');
		res.status(403).json({
			type: 'server',
			error: 'Server error'
		});
	}
});
router.post('/activity', async (req, res) => {
	try {
		const isAuthenticated = await adminAuth(req, res);
		const isInserted = await adminModel.setActivity(req, res);
	} catch (err) {
		console.log(err);
		res.status(403).json({
			type: 'server',
			error: 'Server error'
		});
	}
});
router.get('/activity/incomplete', async (req, res) => {
	try {
		const isAuthenticated = await adminAuth(req, res);
		const getIncomplete = await adminModel.getIncomplete(req, res);
		///End codeing here at 7: 25
	} catch (err) {
		res.status(403).json({
			type: 'server',
			error: 'Server error'
		});
	}
});

module.exports = router;
