export function msgBox(msgBoxStatus) {
  return function(dispatch) {
    dispatch({
      type: 'MSG_BOX_FULFILLED',
      payload: {
        msgBoxStatus: msgBoxStatus
      }
    });
  };
}
