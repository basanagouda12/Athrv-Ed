const express = require('express');
const router = express.Router();
const auth = require('../Auth/auth');
const adminprofileModel = require('../model/adminprofileModel');
const UserController = require('../controllers/UserController');

router.post('/', async (req, res) => {
	const isValid = await auth(req, res);
	//console.log(req);
	if(req.body.type=='A'){
		try{
			console.log('inside the insert router');
			let { firstname,
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
				user_id
				 }=req.body;
				console.log('database properly extracted');
			let num=await adminprofileModel.admindetails( firstname,
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
				user_id);
				res.json(num);
	
		}catch(error){
			console.log(error)
		}

	}
	else{
		await UserController.editProfile(req, res);
	}

});

router.post('/skills', async (req, res) => {
	const isValid = await auth(req, res);
	await UserController.postskills(req, res);
});
router.get('/', async (req, res) => {
	const isValid = await auth(req, res);
	console.log(' inside profile route - user type is  : ', req.body.type);
	await UserController.getProfile(req, res);
});
router.post('/qualification', async (req, res) => {
	const isValid = await auth(req, res);

	await UserController.setQualifications(req, res);
});

router.get('/get', async (req, res) => {
	try{
		console.log(' inside Admin profile route - user type is  : ', req.body);
	let { firstname}=req.body;
	let userdata=await adminprofileModel.getProfile(firstname);
	res.json(userdata);

	}catch(error){
		console.log(error);
	}

});

module.exports = router;
