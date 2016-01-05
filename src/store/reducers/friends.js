import C from '../../constants';
import initialState from '../initialstate';

export default (currentstate, action) => {
	switch (action.type) {
		case C.RECEIVE_FRIENDS_DATA:
			return Object.assign({}, currentstate, {
				hasreceiveddata: true,
				data: action.data || {}
			});
		default: return currentstate || initialState.friends;
	}
};
