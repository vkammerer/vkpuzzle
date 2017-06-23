import C from '../constants';
import Firebase from 'firebase';
import { initFriendships } from '../common/friendships';
import { getFacebookFriends } from '../utils/facebook';

const usersRef = new Firebase(C.FIREBASE).child('users');

let friendships = {};

const untrackOldFriendships = () => {
	Object.keys(friendships).forEach(friendUid => {
		usersRef.child(friendUid).off('value');
	});
};

const trackNewFriendships = () => {
	return (dispatch, getState) => {
		Object.keys(friendships).forEach(friendUid => {
			usersRef.child(friendUid).on('value', (snapshot) => {
				dispatch({
					type: C.RECEIVE_FRIEND_DATA,
					id: friendUid,
					data: snapshot.val() || {}
				});
			});
		});
	};
};

const friendsActions = {
	initFriends() {
		return (dispatch, getState) => {
			const state = getState();
			const refName = 'friendships';
			const uid = state.auth.uid;
			const token = state.auth.token;
			initFriendships(refName, uid, getFacebookFriends.bind(this, token), (newFriendships) => {
				untrackOldFriendships();
				friendships = newFriendships;
				dispatch(trackNewFriendships());
			});
		};
	},
};

export default friendsActions;
