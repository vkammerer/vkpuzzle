import { combineReducers } from 'redux';
import authReducer from './auth';
import feedbackReducer from './feedback';
import friendsReducer from './friends';
import articlesReducer from './articles';

const rootReducer = combineReducers({
	auth: authReducer,
	feedback: feedbackReducer,
	friends: friendsReducer,
	articles: articlesReducer
});

export default rootReducer;
