const fetch = require('node-fetch')
const TwitchStrategy = require('@d-fischer/passport-twitch').Strategy

async function streamInfo(streamIds, user) {
	const fetcher = async (streamId) => {
		const urlStreamData = `https://api.twitch.tv/helix/streams?user_id=${streamId}`
		// Always verify our token first. It can be rejected at any time
		user.accessToken && await verifyToken(user.accessToken)

		const response = await fetch(urlStreamData, {
			headers: new fetch.Headers({
				'Client-ID': process.env.TWITCH_CLIENT_ID,
				Authorization: `Bearer ${user.accessToken}`,
			}),
		})
		const json = await response.json()
		const stream = json.data
		return {
			id: streamId,
			info: stream && {
				id: streamId,
				count: stream.viewer_count,
				language: stream.language,
				title: stream.title,
			},
		}
	}
	return Promise.all(streamIds.map(fetcher))
}

async function verifyToken(token) {
	// TODO: automatically logout user from puppet if token is revoked.
	const url = 'https://id.twitch.tv/oauth2/validate'
	const response = await fetch(url, {
		headers: new fetch.Headers({
			'Client-ID': process.env.TWITCH_CLIENT_ID,
			Authorization: `Bearer ${token}`,
		}),
	})
	const result = await response.json()
	return result.expires_in > 0
}

const strategy = new TwitchStrategy(
	{
		clientID: process.env.TWITCH_CLIENT_ID,
		clientSecret: process.env.TWITCH_CLIENT_SECRET,
		callbackURL: process.env.TWITCH_CALLBACK,
		scope: '',
	},
	async (accessToken, _refreshToken, profile, cb) => {
		if (await verifyToken(accessToken)) {
			cb(undefined, {
				id: profile.id,
				name: profile.login,
				picture: profile.profile_image_url,
				service: 'twitch',
				accessToken: accessToken,
			})
		} else {
			// token is expired or invalid
			cb(undefined, false)
		}
	}
)

module.exports = {
	strategy,
	streamInfo,
}
