export function updateUser(whichField, newValue){
  if(whichField === 'avatar'){
    let avatar = newValue;
  }
  return function(dispatch) {
    dispatch({
      type: 'UPDATE_USER_FULFILLED',
      payload: {
        pw: pw,
        birthday: birthday,
        avatar: avatar,
        nickname: nickname,
        job: job,
        company: company,
        description: description,
        membersince: membersince,
        kanton: kanton,
        socialFb: socialFb,
        socialGithub: socialGithub,
        socialTwitter: socialTwitter,
        socialLinkedin: socialLinkedin,
        socialXing: socialXing,
        socialWebsite: socialWebsite
      }
    });
  };
}
