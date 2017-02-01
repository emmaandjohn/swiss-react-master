export function getRateEntries(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_RATE_ENTRIES_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
