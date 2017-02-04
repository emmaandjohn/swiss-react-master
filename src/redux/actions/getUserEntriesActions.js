export function getUserEntries(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_USER_ENTRIES_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
