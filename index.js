const router = require('express')();
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const secret = 'sausages';

router.use(cookieParser())

/* handle cookie token as middleware */
router.use(function (req, res, next) {
	if ( req.path === '/login') return next();
	
	const token = req?.cookies?.auth_token;
	if (!token) {
		return res.status(403).send('Access Denied');
	}
	try{
		const verified = jwt.verify(token, secret);
		req.user = verified;
		next();
	} catch (err) {
		res.status(403).send('Invalid Token');
	}
})

router.post('/login', async (req,res) => {
	const token = jwt.sign({_id: 1}, secret);
	res.cookie('auth_token', token, { httpOnly: true });
	return res.send('Logged In');
})

router.get('/getLoggedInUser', async (req,res) => {
	res.send(req?.user);
})

router.listen(3001, () => console.log(`Listening port 3001`));
