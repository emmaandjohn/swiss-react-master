export default function reducer(state={
    user: {
      email: null,
      pw: null,
      uuid: null,
      activation: null,
      loading: false
    },
  }, action) {
    switch (action.type) {
      case 'GET_USER_FULFILLED': {
        return {
          ...state,
          user: action.payload,
        };
      }
    }
    return state;
}
