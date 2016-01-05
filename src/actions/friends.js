import C from '../constants';
import Firebase from 'firebase';
import { is, fromJS } from 'immutable';
import usersActions from './users';

const friendsRef = new Firebase(C.FIREBASE).child('friends');
const friendRequestsRef = new Firebase(C.FIREBASE).child('friendrequests');

const getFacebookFriends = (token) => {
	return fetch('https://graph.facebook.com/v2.0/me?fields=friends&access_token=' + token)
		.then(r => r.json())
		.then(fbData => {
			const thisPromise = new Promise((resolve) => {
				const friends = {};
				fbData.friends.data.forEach(friend => {
					const uid = 'facebook:' + friend.id;
					friends[uid] = uid;
				});
				resolve(friends);
			});
			return thisPromise;
		});
};

const friendsActions = {
	initFriends() {
		return (dispatch) => {
			dispatch(this.listenToFriends());
			dispatch(this.listenToFriendrequests());
			dispatch(this.compareFriendsWithFacebookFriends()).then(() => {
				dispatch(this.sendFriendrequests());
			});
		};
	},
	listenToFriends() {
		return (dispatch, getState) => {
			const uid = getState().auth.uid;
			friendsRef.child(uid).on('value', (snapshot) => {
				dispatch({ type: C.RECEIVE_FRIENDS_DATA, data: snapshot.val() });
				dispatch(usersActions.trackFriendlyUsers());
			});
		};
	},
	listenToFriendrequests() {
		return (dispatch, getState) => {
			const uid = getState().auth.uid;
			friendRequestsRef.child(uid).set(null);
			friendRequestsRef.child(uid).on('child_added', (snapshot) => {
				const friends = getState().friends.data;
				if (!friends[snapshot.val()]) {
					dispatch(this.compareFriendsWithFacebookFriends()).then(() => {
						dispatch(this.sendFriendrequests());
						dispatch(usersActions.trackFriendlyUsers());
					});
				} else {
					dispatch(usersActions.trackFriendlyUsers());
				}
			});
		};
	},
	compareFriendsWithFacebookFriends() {
		return (dispatch, getState) => {
			const token = getState().auth.token;
			const thisPromise = new Promise((resolve) => {
				getFacebookFriends(token).then((fbFriends) => {
					const friends = getState().friends.data;
					if (!is(fromJS(friends), fromJS(fbFriends))) {
						dispatch(this.saveFriends(fbFriends)).then(resolve);
					} else {
						resolve();
					}
				});
			});
			return thisPromise;
		};
	},
	sendFriendrequests() {
		return (dispatch, getState) => {
			const state = getState();
			const uid = state.auth.uid;
			const friends = state.friends.data;
			Object.keys(friends).forEach((friendUid) => {
				friendRequestsRef.child(friendUid).child(uid).set(uid, (error) => {
					if (error) {
						console.log('friendsRef requested save error: ', error);
					}
				});
			});
		};
	},
	saveFriends(friends) {
		return (dispatch, getState) => {
			const state = getState();
			const uid = state.auth.uid;
			const thisPromise = new Promise((resolve) => {
				friendsRef.child(uid).set(friends, (error) => {
					if (error) {
						console.log('friendsRef confirmed save error: ', error);
					} else {
						resolve();
					}
				});
			});
			return thisPromise;
		};
	}
};

export default friendsActions;
