import C from '../constants';
import Firebase from 'firebase';

const articlesRef = new Firebase(C.FIREBASE).child('articles');

const articlesActions = {
	listenToArticles() {
		return (dispatch) => {
			articlesRef.on('value', (snapshot) => {
				dispatch({ type: C.RECEIVE_ARTICLES_DATA, data: snapshot.val() });
			});
		};
	},
	submitNewArticle(content) {
		return (dispatch, getState) => {
			const state = getState();
			const uid = state.auth.uid;
			const error = false;
			if (error) {
				dispatch({ type: C.DISPLAY_ERROR, error });
			} else {
				dispatch({ type: C.AWAIT_NEW_ARTICLE_RESPONSE });
				articlesRef.push({ content, uid }, (error2) => {
					dispatch({ type: C.RECEIVE_NEW_ARTICLE_RESPONSE });
					if (error2) {
						dispatch({ type: C.DISPLAY_ERROR, error: 'Submission failed! ' + error2 });
					} else {
						dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!' });
					}
				});
			}
		};
	},
	startArticleEdit(qid) {
		return { type: C.START_ARTICLE_EDIT, qid };
	},
	cancelArticleEdit(qid) {
		return { type: C.FINISH_ARTICLE_EDIT, qid };
	},
	submitArticleEdit(qid, content) {
		return (dispatch, getState) => {
			const state = getState();
			const uid = state.auth.uid;
			const error = false;
			if (error) {
				dispatch({ type: C.DISPLAY_ERROR, error });
			} else {
				dispatch({ type: C.SUBMIT_ARTICLE_EDIT, qid });
				articlesRef.child(qid).set({ content, uid }, (error2) => {
					dispatch({ type: C.FINISH_ARTICLE_EDIT, qid });
					if (error2) {
						dispatch({ type: C.DISPLAY_ERROR, error: 'Update failed! ' + error2 });
					} else {
						dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!' });
					}
				});
			}
		};
	},
	deleteArticle(qid) {
		return (dispatch) => {
			dispatch({ type: C.SUBMIT_ARTICLE_EDIT, qid });
			articlesRef.child(qid).remove((error) => {
				dispatch({ type: C.FINISH_ARTICLE_EDIT, qid });
				if (error) {
					dispatch({ type: C.DISPLAY_ERROR, error: 'Deletion failed! ' + error });
				} else {
					dispatch({ type: C.DISPLAY_MESSAGE, message: 'Article successfully deleted!' });
				}
			});
		};
	}
};

export default articlesActions;
