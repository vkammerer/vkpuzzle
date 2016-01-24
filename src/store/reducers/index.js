import { combineReducers } from 'redux';
import authReducer from './auth';
import feedbackReducer from './feedback';
import friendsReducer from './friends';
import friendshipsReducer from './friendships';
import articlesReducer from './articles';

const rootReducer = combineReducers({
	auth: authReducer,
	feedback: feedbackReducer,
	friends: friendsReducer,
	friendships: friendshipsReducer,
	articles: articlesReducer
});

export default rootReducer;
