export function registerNewUser(activation, email, pw, uuid) {
  return function(dispatch) {
    dispatch({
      type: 'REGISTER_NEW_USER_FULFILLED',
      payload: {
        activation: activation,
        email: email,
        pw: pw,
        uuid: uuid
      }
    });
  };
}
