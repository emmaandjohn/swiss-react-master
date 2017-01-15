export default function reducer(state={
    msgcontent: {
      status: false,
      msg: null
    },
  }, action) {
    switch (action.type) {
      case 'MSG_BOX_FULFILLED': {
        return {
          ...state,
          msgcontent: action.payload,
        };
      }
    }
    return state;
}
