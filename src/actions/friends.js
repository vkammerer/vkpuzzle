import C from '../constants';
import Firebase from 'firebase';

const usersRef = new Firebase(C.FIREBASE).child('users');

let friendships = {};

const friendsActions = {
	trackFriendlyUsers() {
		return (dispatch, getState) => {
			Object.keys(friendships).forEach(friendUid => {
				usersRef.child(friendUid).off('value');
			});
			friendships = getState().friendships.data;
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
	}
};

export default friendsActions;
