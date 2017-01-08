export default function reducer(state={
    articleList: {
      articles: []
    },
  }, action) {
    switch (action.type) {
      case 'GET_SEARCH_ENTRIES_FULFILLED': {
        return {
          ...state,
          articleList: action.payload,
        };
      }
    }
    return state;
}
