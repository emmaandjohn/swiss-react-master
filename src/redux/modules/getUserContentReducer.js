export default function reducer(state={
    articleList: {
      articles: []
    },
  }, action) {
    switch (action.type) {
      case 'GET_USER_CONTENT_FULFILLED': {
        return {
          ...state,
          articleList: action.payload,
        };
      }
    }
    return state;
}
