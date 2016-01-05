import C from '../constants';
import Firebase from 'firebase';
import usersActions from './users';
import friendsActions from './friends';

const fireRef = new Firebase(C.FIREBASE);

const authActions = {
	listenToAuth() {
		return (dispatch) => {
			fireRef.onAuth((authData) => {
				console.log('fireRef.onAuth');
				console.log(authData);
				if (authData) {
					dispatch({
						type: C.LOGIN_USER,
						uid: authData.uid,
						data: authData.facebook.cachedUserProfile,
						token: authData.facebook.accessToken
					});
					dispatch(usersActions.initAuthenticatedUser());
					dispatch(friendsActions.initFriends());
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
			dispatch(usersActions.setAuthenticatedUserOffline());
			dispatch({ type: C.LOGOUT });
			fireRef.unauth();
		};
	}
};

export default authActions;
