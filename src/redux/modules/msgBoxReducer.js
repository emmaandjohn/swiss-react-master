export default function reducer(state={
    msgBoxStatus: {
      status: false,
      msg: null
    },
  }, action) {
    switch (action.type) {
      case 'MSG_BOX_FULFILLED': {
        return {
          ...state,
          msgBoxStatus: action.payload,
        };
      }
    }
    return state;
}
