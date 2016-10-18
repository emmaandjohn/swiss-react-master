export default function reducer(state={
    user: {
      email: null,
      pw: null,
      uuid: null,
      activation: null
    },
  }, action) {
    switch (action.type) {
      case 'REGISTER_NEW_USER_FULFILLED': {
        return {
          ...state,
          user: action.payload,
        };
      }
    }
    return state;
}
