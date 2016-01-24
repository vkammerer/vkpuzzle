import C from '../constants';
import Firebase from 'firebase';
import { is, fromJS } from 'immutable';
import { mapToObject } from '../utils/common';
import { getFacebookFriends, checkFacebookFriend } from '../utils/facebook';
import { realOnChildAdded } from '../utils/firebase';
import friendsActions from './friends';

const friendshipsRef = new Firebase(C.FIREBASE).child('friendships');
const friendsInMe = new Map();
const meInFriends = new Map();

const getRealFriends = () => {
	return (dispatch, getState) => {
		const realFriendships = mapToObject(new Map(
			[...friendsInMe].filter(([friend, status]) => {
				return (
					(friendsInMe.get(friend) === 'confirmed') &&
					(meInFriends.get(friend) === 'confirmed')
				);
			})
		));
		const currentFriendships = getState().friendships.data;
		dispatch({ type: C.RECEIVE_FRIENDSHIPS_DATA, data: realFriendships });
		if (!is(fromJS(currentFriendships), fromJS(realFriendships))) {
			dispatch(friendsActions.trackFriendlyUsers());
		}
	};
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

const setFriendInMe = (state, friend) => {
	const uid = state.auth.uid;
	return setFriend(uid, friend, 'confirmed');
};

const setMeInFriend = (state, friend) => {
	const uid = state.auth.uid;
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
	return (dispatch, getState) => {
		const state = getState();
		const friendsPromises = [...friendsInMe].map(([friend, status]) => {
			return setFriendInMe(state, friend);
		});
		const initializedPromises = friendsPromises.concat([setFriendInMe(state, '_initialized')]);
		return Promise.all(initializedPromises);
	};
};

const setMeInFriends = () => {
	return (dispatch, getState) => {
		const state = getState();
		const promises = [...meInFriends].map(([friend, status]) => {
			return setMeInFriend(state, friend);
		});
		return Promise.all(promises);
	};
};

const listenToFriendsInMe = () => {
	return (dispatch, getState) => {
		const state = getState();
		const uid = state.auth.uid;
		const token = state.auth.token;
		realOnChildAdded(friendshipsRef.child(uid), (snapshot) => {
			const friend = snapshot.key();
			meInFriends.set(friend, 'confirmed');
			friendsInMe.set(friend, 'requesting');
			checkFacebookFriend(token, friend).then((isFriend) => {
				if (isFriend) {
					setFriendInMe(state, friend).then(() => {
						friendsInMe.set(friend, 'confirmed');
						dispatch(getRealFriends());
					});
				}
			});
		});
	};
};

const listenToMeInFriend = (friend) => {
	return (dispatch, getState) => {
		const uid = getState().auth.uid;
		const meInFriendRef = friendshipsRef.child(friend).child(uid);
		meInFriendRef.on('value', (snapshot) => {
			if (snapshot.val() === 'confirmed') {
				meInFriendRef.off('value');
				meInFriends.set(friend, 'confirmed');
				dispatch(getRealFriends());
			}
		});
	};
};

const listenToMeInFriends = () => {
	return (dispatch, getState) => {
		const requestedFriends = new Map([...meInFriends].filter(([friend, status]) => {
			return status === 'requesting';
		}));
		requestedFriends.forEach((status, friend) => {
			dispatch(listenToMeInFriend(friend));
		});
	};
};

export function initFriendships() {
	return (dispatch, getState) => {
		const state = getState();
		const token = state.auth.token;
		getFacebookFriends(token).then((friends) => {
			friends.forEach((friend) => {
				friendsInMe.set(friend, 'confirmed');
				meInFriends.set(friend, 'unknown');
			});
			Promise.all([
				dispatch(setFriendsInMe()),
				dispatch(setMeInFriends())
			]).then(() => {
				dispatch(getRealFriends());
				dispatch(listenToFriendsInMe());
				dispatch(listenToMeInFriends());
			});
		});
	};
}
