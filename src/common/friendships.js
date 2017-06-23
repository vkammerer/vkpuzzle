import C from '../constants';
import Firebase from 'firebase';
import { is, fromJS } from 'immutable';
import { mapToObject } from '../utils/common';
import { realOnChildAdded } from '../utils/firebase';

export function initFriendships(collectionName, uid, getFriendsList, callback) {
	const friendshipsRef = new Firebase(C.FIREBASE).child(collectionName);
	const friendsInMe = new Map();
	const meInFriends = new Map();
	let friendships = {};

	const getFriendships = () => {
		const nextFriendships = mapToObject(new Map(
			[...friendsInMe].filter(([friend, status]) => {
				return (
					(friendsInMe.get(friend) === 'confirmed') &&
					(meInFriends.get(friend) === 'confirmed')
				);
			})
		));
		if (!is(fromJS(friendships), fromJS(nextFriendships))) {
			friendships = nextFriendships;
			callback(nextFriendships);
		}
	};

	const setFriend = (keyFriend, valueFriend, status) => {
		return new Promise((resolve, reject) => {
			friendshipsRef.child(keyFriend).child(valueFriend).set(status, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};

	const setFriendInMe = (friend) => {
		return setFriend(uid, friend, 'confirmed');
	};

	const setMeInFriend = (friend) => {
		return new Promise((resolve) => {
			friendshipsRef.child(friend).child(uid).once('value', (snapshot) => {
				const status = snapshot.val();
				if (status === 'confirmed') {
					meInFriends.set(friend, 'confirmed');
					resolve();
				} else {
					setFriend(friend, uid, 'requesting').then(() => {
						meInFriends.set(friend, 'requesting');
						resolve();
					});
				}
			});
		});
	};

	const setFriendsInMe = () => {
		const friendsPromises = [...friendsInMe].map(([friend, status]) => {
			return setFriendInMe(friend);
		});
		const initializedPromises = friendsPromises.concat([setFriendInMe('_initialized')]);
		return Promise.all(initializedPromises);
	};

	const setMeInFriends = () => {
		const promises = [...meInFriends].map(([friend, status]) => {
			return setMeInFriend(friend);
		});
		return Promise.all(promises);
	};

	const listenToFriendsInMe = () => {
		realOnChildAdded(friendshipsRef.child(uid), (snapshot) => {
			const friend = snapshot.key();
			meInFriends.set(friend, 'confirmed');
			friendsInMe.set(friend, 'requesting');
			getFriendsList().then((friends) => {
				if (friends.indexOf(friend) !== -1) {
					setFriendInMe(friend).then(() => {
						friendsInMe.set(friend, 'confirmed');
						getFriendships();
					});
				}
			});
		});
	};

	const listenToMeInFriend = (friend) => {
		const meInFriendRef = friendshipsRef.child(friend).child(uid);
		meInFriendRef.on('value', (snapshot) => {
			if (snapshot.val() === 'confirmed') {
				meInFriendRef.off('value');
				meInFriends.set(friend, 'confirmed');
				getFriendships();
			}
		});
	};

	const listenToMeInFriends = () => {
		const requestedFriends = new Map([...meInFriends].filter(([friend, status]) => {
			return status === 'requesting';
		}));
		requestedFriends.forEach((status, friend) => {
			listenToMeInFriend(friend);
		});
	};

	getFriendsList().then((friends) => {
		friends.forEach((friend) => {
			friendsInMe.set(friend, 'confirmed');
			meInFriends.set(friend, 'unknown');
		});
		Promise.all([
			setFriendsInMe(),
			setMeInFriends()
		]).then(() => {
			getFriendships();
			listenToFriendsInMe();
			listenToMeInFriends();
		});
	});
}
