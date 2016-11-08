export default function reducer(state={
    user: {
      pw: null,
      birthday: null,
      avatar: null,
      nickname: null,
      job: null,
      company: null,
      description: null,
      membersince: null,
      kanton: null,
      socialFb: null,
      socialGithub: null,
      socialTwitter: null,
      socialLinkedin: null,
      socialXing: null,
      socialWebsite: null
    },
  }, action) {
    switch (action.type) {
      case 'UPDATE_USER_FULFILLED': {
        return {
          ...state,
          user: action.payload,
        };
      }
    }
    return state;
}
