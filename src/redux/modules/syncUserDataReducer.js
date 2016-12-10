export default function reducer(state={
    userList: {
      userdata: []
    },
  }, action) {
    switch (action.type) {
      case 'SYNC_USER_DATA_FULFILLED': {
        return {
          ...state,
          userList: action.payload,
        };
      }
    }
    return state;
}
