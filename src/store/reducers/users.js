import C from '../../constants';
import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
		case C.RECEIVE_USER_DATA:
			const data = Object.assign({}, currentstate.data, {
				[action.id]: action.data
			});
			return Object.assign({}, currentstate, {
				hasreceiveddata: true,
				data
			});
		case C.AWAIT_SAVE_USER_RESPONSE:
			return Object.assign({}, currentstate);
		case C.RECEIVE_SAVE_USER_RESPONSE:
			return Object.assign({}, currentstate);
		default: return currentstate || initialState.users;
	}
};
