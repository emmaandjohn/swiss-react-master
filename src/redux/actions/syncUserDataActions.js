export function syncUserData(userdata) {
  return function(dispatch) {
    dispatch({
      type: 'SYNC_USER_DATA_FULFILLED',
      payload: {
        userdata: userdata
      }
    });
  };
}
