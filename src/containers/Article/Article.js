import React, {Component} from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';

@connect((store) => {
  return {
    activateNewUserState: store.activateNewUser.userStatus,
    getBlogEntriesState: store.getBlogEntries.articleList,
  };
})

export default class Article extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    specificArticleData: {}
  }

  componentDidMount() {
    let getUrl = this.props.params.id;

    superagent
    .post('/getSpecificArticleWithUrl')
    .send({ urlFriendly: getUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.setState({specificArticleData: res.body.specificArticleData});
      } else{
        console.log("Error, Article url does not exist in DB");
      }
    });
  }

  render() {
    const styles = require('../Home/Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');

    const {formStatus, formMsg, specificArticleData} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;

    console.log("specificArticleData: "+JSON.stringify(specificArticleData));

    return (
      <div className="container" id="articlePage">
        <Helmet title="Article"/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
          <div className='row'>
            <div className={styles.topLine + ' col-xs-12'}>
              <div className='col-xs-1'>
                <div className={stylesMyProfile['avatar'+specificArticleData.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              </div>
              <div className='col-xs-2'>{specificArticleData.userNickname}</div>
              <div className='col-xs-3'><strong>{specificArticleData.titel}</strong></div>
              <div className='col-xs-1'><span className="label label-primary">{specificArticleData.category}</span></div>
              <div className={'col-xs-3 ' + styles.techStyle}>{specificArticleData.technologies}</div>
              <div className={'col-xs-2 ' + styles.dateStyle}>{specificArticleData.timeFormatted}</div>
              <div className={'col-xs-12'}>{specificArticleData.markup}</div>
            </div>
          </div>
        : null
        }
      </div>
    );
  }
}
