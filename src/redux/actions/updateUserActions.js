export function updateUser(whichField, newValue, userData){
  var pw = userData.pw;
  var birthday = userData.birthday;
  var avatar = userData.avatar;
  var nickname = userData.nickname;
  var job = userData.job;
  var company = userData.company;
  var description = userData.description;
  var kanton = userData.kanton;
  var socialFb = userData.socialFb;
  var socialGithub = userData.socialGithub;
  var socialTwitter = userData.socialTwitter;
  var socialLinkedin = userData.socialLinkedin;
  var socialXing = userData.socialXing;
  var socialWebsite = userData.socialWebsite;

  if(whichField === 'pw'){pw = newValue;}
  if(whichField === 'birthday'){birthday = newValue;}
  if(whichField === 'avatar'){avatar = newValue;}
  if(whichField === 'nickname'){nickname = newValue;}
  if(whichField === 'job'){job = newValue;}
  if(whichField === 'company'){company = newValue;}
  if(whichField === 'description'){description = newValue;}
  if(whichField === 'kanton'){kanton = newValue;}
  if(whichField === 'socialFb'){socialFb = newValue;}
  if(whichField === 'socialGithub'){socialGithub = newValue;}
  if(whichField === 'socialTwitter'){socialTwitter = newValue;}
  if(whichField === 'socialLinkedin'){socialLinkedin = newValue;}
  if(whichField === 'socialXing'){socialXing = newValue;}
  if(whichField === 'socialWebsite'){socialWebsite = newValue;}
  
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
