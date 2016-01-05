import authActions from './auth';
import feedbackActions from './feedback';
import usersActions from './users';
import articleActions from './articles';

export default Object.assign(
	{},
	authActions,
	feedbackActions,
	articleActions,
	usersActions
);
