export function getFacebookFriends(token) {
	return new Promise((resolve) => {
		fetch('https://graph.facebook.com/v2.5/me?fields=friends&access_token=' + token)
			.then(r => r.json())
			.then(fbData => {
				resolve(fbData.friends.data.map(friend => {
					return 'facebook:' + friend.id;
				}));
			});
	});
}
export function checkFacebookFriend(token, friend) {
	return new Promise((resolve) => {
		getFacebookFriends(token).then((friends) => {
			resolve(friends.indexOf(friend) !== -1);
		});
	});
}
