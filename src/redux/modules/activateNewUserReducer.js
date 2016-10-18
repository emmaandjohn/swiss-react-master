export default function reducer(state={
    userStatus: {
      activatedUser: false,
      loggedInUser: false
    },
  }, action) {
    switch (action.type) {
      case 'ACTIVATE_NEW_USER_FULFILLED': {
        return {
          ...state,
          userStatus: action.payload,
        };
      }
    }
    return state;
}
