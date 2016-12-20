export function getUserContent(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_USER_CONTENT_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
