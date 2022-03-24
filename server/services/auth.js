const passport = require('passport')
const token = require('./token')

// https://developers.google.com/identity/protocols/oauth2/web-server

function register(app) {
	// Check env for defined authentication methods before attempting to register them
	use_twitch_auth = false;
	use_youtube_auth = false;
	if (
		typeof process.env.YOUTUBE_OAUTH_TEST_APP_CLIENT_ID !== 'undefined'
		&& typeof process.env.YOUTUBE_OAUTH_TEST_APP_CLIENT_SECRET !== 'undefined'
		&& process.env.YOUTUBE_CALLBACK !== 'undefined'
	) use_youtube_auth = true;

	if (
		typeof process.env.TWITCH_CLIENT_ID !== 'undefined'
		&& typeof process.env.TWITCH_CLIENT_SECRET !== 'undefined'
		&& typeof process.env.TWITCH_CALLBACK !== 'undefined'
	) use_twitch_auth = true;

	if (use_youtube_auth) {
		youtube = require('./youtube');
	passport.use(youtube.strategy)
	}

	if (use_twitch_auth) {
		twitch = require('./twitch')
		passport.use(twitch.strategy)
	}

	passport.serializeUser((data, cb) => cb(undefined, data))
	passport.deserializeUser((data, cb) => cb(undefined, data))
	app.use(passport.initialize())

	use_youtube_auth &&
		app.get(
			'/auth/youtube',
			passport.authenticate('youtube', {
				scope: ['email', 'openid', 'profile', 'https://www.googleapis.com/auth/youtube.readonly'],
			}),
			login
		)

	use_twitch_auth && app.get('/auth/twitch', passport.authenticate('twitch', { scope: [''] }), login)
}

function login(req, res) {
	if (!req.user) return
	res.cookie('id_token', token.createUserToken(req.user, '48h'), { maxAge: 48 * 3600 * 1000 })
	res.redirect('/')
}

function authenticate(req, res, next) {
	if (req.path.startsWith('/public') || req.path.startsWith('/i/')) {
		next()
		return
	}
	const wsConnect = req.path.startsWith('/connect')
	token
		.verify(req.cookies['id_token'])
		.then((user) => {
			if (user.game && !wsConnect) {
				res.status(401).send('not authorized')
				return
			}
			req.user = user
			next()
		})
		.catch(() => {
			if (wsConnect) {
				res.status(401).send('not authorized')
				return
			}
			res.redirect('/public/')
		})
}

module.exports = {
	register,
	authenticate,
	passport,
}
