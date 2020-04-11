const jwt = require('jsonwebtoken');

async function auth(req, res) {
	let token = req.header('x-auth-token');
	if (!token)
		return res.status(403).json({
			auth: 'No token sent'
		});
	try {
		var result = jwt.verify(token, 'secret');
		req.body.user = result.user_id;
		req.body.type = result.type;
		if (req.body.type !== 'A') {
			console.log(req.body.type);
			return res.status(403).json({
				type: 'email',
				error: 'Unauthorized Access'
			});
		}
		console.log(result.type);
		return;
	} catch (err) {
		console.log(result);
		console.log(err);
		return res.status(500).json({
			server: 'Token info invalid'
		});
	}
}
module.exports = auth;
