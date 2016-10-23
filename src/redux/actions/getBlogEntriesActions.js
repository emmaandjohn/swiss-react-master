export function getBlogEntries(articles) {
  return function(dispatch) {
    dispatch({
      type: 'GET_BLOG_ENTRIES_FULFILLED',
      payload: {
        articles: articles
      }
    });
  };
}
