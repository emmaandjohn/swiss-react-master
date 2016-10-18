export function activateNewUser(activatedUser, loggedInUser) {
  return function(dispatch) {
    dispatch({
      type: 'ACTIVATE_NEW_USER_FULFILLED',
      payload: {
        activatedUser: activatedUser,
        loggedInUser: loggedInUser
      }
    });
  };
}
