export default function reducer(state={
    articleList: {
      articles: null
    },
  }, action) {
    switch (action.type) {
      case 'GET_BLOG_ENTRIES_FULFILLED': {
        return {
          ...state,
          articleList: action.payload,
        };
      }
    }
    return state;
}
