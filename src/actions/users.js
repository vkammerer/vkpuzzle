import C from '../constants';
import Firebase from 'firebase';
import { is, fromJS } from 'immutable';

const usersRef = new Firebase(C.FIREBASE).child('users');

let friends = {};

const usersActions = {
	trackFriendlyUsers() {
		return (dispatch, getState) => {
			Object.keys(friends).forEach(friendUid => {
				usersRef.child(friendUid).off('value');
			});
			friends = getState().friends.data;
			Object.keys(friends).forEach(friendUid => {
				usersRef.child(friendUid).on('value', (snapshot) => {
					dispatch({ type: C.RECEIVE_USER_DATA, id: friendUid, data: snapshot.val() || {} });
				});
			});
		};
	},
	setAuthenticatedUserOffline() {
		return (dispatch, getState) => {
			const uid = getState().auth.uid;
			usersRef.child(uid).update({ online: null });
		};
	},
	initAuthenticatedUser() {
		return (dispatch, getState) => {
			const user = getState().auth;
			usersRef.child(user.uid).update({ online: true });
			usersRef.child(user.uid).once('value', (data) => {
				const dataVal = data.val();
				if (!is(fromJS(user.data), fromJS(dataVal))) {
					dispatch(this.saveAuthenticatedUser()).then(() => {
						usersRef.child(user.uid).onDisconnect().update({ online: null });
					});
				} else {
					usersRef.child(user.uid).onDisconnect().update({ online: null });
				}
			});
		};
	},
	saveAuthenticatedUser() {
		return (dispatch, getState) => {
			const user = getState().auth;
			const thisPromise = new Promise((resolve) => {
				usersRef.child(user.uid).update(user.data, (error) => {
					if (error) {
						dispatch({ type: C.DISPLAY_ERROR, error: 'User submission failed! ' + error });
					} else {
						dispatch({ type: C.DISPLAY_MESSAGE, message: 'User successfully saved!' });
						resolve();
					}
				});
			});
			return thisPromise;
		};
	}
};

export default usersActions;
