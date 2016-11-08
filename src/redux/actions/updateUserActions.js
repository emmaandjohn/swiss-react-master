export function updateUser(whichField, newValue){
  var avatar = '';
  console.log("Action whichfield OK: "+ whichField + newValue);
  if(whichField === 'avatar'){
    avatar = newValue;
  }
  return function(dispatch) {
    dispatch({
      type: 'UPDATE_USER_FULFILLED',
      payload: {
        pw: pw ? pw : undefined,
        birthday: birthday ? birthday : undefined,
        avatar: avatar ? avatar : undefined,
        nickname: nickname ? nickname : undefined,
        job: job ? job : undefined,
        company: company ? company : undefined,
        description: description ? description : undefined,
        membersince: membersince ? membersince : undefined,
        kanton: kanton ? kanton : undefined,
        socialFb: socialFb ? socialFb : undefined,
        socialGithub: socialGithub ? socialGithub : undefined,
        socialTwitter: socialTwitter ? socialTwitter : undefined,
        socialLinkedin: socialLinkedin ? socialLinkedin : undefined,
        socialXing: socialXing ? socialXing : undefined,
        socialWebsite: socialWebsite ? socialWebsite : undefined
      }
    });
  };
}
