export function getUser(activation, email, pw, uuid) {
  return function(dispatch) {
    dispatch({
      type: 'GET_USER_FULFILLED',
      payload: {
        activation: activation,
        email: email,
        pw: pw,
        uuid: uuid,
        loading: true
      }
    });
  };
}
