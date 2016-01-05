import C from '../../constants';
import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
		case C.ATTEMPTING_LOGIN:
			return {
				currently: C.AWAITING_AUTH_RESPONSE,
				uid: null,
				data: {},
				token: null
			};
		case C.LOGOUT:
			return {
				currently: C.ANONYMOUS,
				uid: null,
				data: {},
				token: null
			};
		case C.LOGIN_USER:
			return {
				currently: C.LOGGED_IN,
				uid: action.uid,
				data: action.data,
				token: action.token
			};
		default: return currentstate || initialState.auth;
	}
};
