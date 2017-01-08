export function getSearchEntries(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_SEARCH_ENTRIES_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
