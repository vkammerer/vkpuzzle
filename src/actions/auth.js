import C from '../constants';
import Firebase from 'firebase';
import { initFriendships } from './friendships';
import { is, fromJS } from 'immutable';

const fireRef = new Firebase(C.FIREBASE);
const usersRef = fireRef.child('users');

const authActions = {
	listenToAuth() {
		return (dispatch) => {
			fireRef.onAuth((authData) => {
				if (authData) {
					dispatch({
						type: C.LOGIN_USER,
						uid: authData.uid,
						data: authData.facebook.cachedUserProfile,
						token: authData.facebook.accessToken
					});
					dispatch(this.initAuthenticatedUser());
					dispatch(initFriendships());
				}
			});
		};
	},
	attemptLogin() {
		return (dispatch) => {
			dispatch({ type: C.ATTEMPTING_LOGIN });
			fireRef.authWithOAuthPopup('facebook', (error) => {
				if (error) {
					dispatch({ type: C.DISPLAY_ERROR, error: 'Login failed! ' + error });
					dispatch({ type: C.LOGOUT });
				}
			}, {
				scope: 'user_friends'
			});
		};
	},
	logoutUser() {
		return (dispatch) => {
			dispatch(this.setAuthenticatedUserOffline());
			dispatch({ type: C.LOGOUT });
			fireRef.unauth();
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
			const state = getState();
			const uid = state.auth.uid;
			const data = state.auth.data;
			const userRef = usersRef.child(uid);
			userRef.update({ online: true });
			userRef.once('value', (snapshot) => {
				const dataVal = snapshot.val();
				if (!is(fromJS(data), fromJS(dataVal))) {
					dispatch(this.saveAuthenticatedUser()).then(() => {
						userRef.onDisconnect().update({ online: null });
					});
				} else {
					userRef.onDisconnect().update({ online: null });
				}
			});
		};
	},
	saveAuthenticatedUser() {
		return (dispatch, getState) => {
			const state = getState();
			const uid = state.auth.uid;
			const data = state.auth.data;
			return new Promise((resolve, reject) => {
				usersRef.child(uid).update(data, (error) => {
					if (error) {
						dispatch({ type: C.DISPLAY_ERROR, error: 'User submission failed! ' + error });
						reject(error);
					} else {
						dispatch({ type: C.DISPLAY_MESSAGE, message: 'User successfully saved!' });
						resolve();
					}
				});
			});
		};
	}
};

export default authActions;
