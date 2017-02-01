export function getCommentEntries(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_COMMENT_ENTRIES_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
