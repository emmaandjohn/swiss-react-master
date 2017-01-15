export function msgBox(status, msg) {
  return function(dispatch) {
    dispatch({
      type: 'MSG_BOX_FULFILLED',
      payload: {
        status: status,
        msg: msg
      }
    });
  };
}
