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

    console.log(
      Object.keys(specificArticleData.technologies[0]).map(
        key => specificArticleData.technologies[0][key]
      ).bind.(specificArticleData.technologies[0]);
    );

    return (
      <div className="container" id="articlePage">
        <Helmet title={specificArticleData.titel}/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
          <div className='row'>
            <div className={'col-xs-12'}>
              <div className='row'>
                <div className='col-xs-12'><h1>{specificArticleData.titel}</h1></div>
                <div className='col-sm-3 col-xs-6'>
                  <div className={stylesMyProfile['avatar'+specificArticleData.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                  <div className={stylesMyProfile['flag'+specificArticleData.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                </div>
                <div className='col-sm-9 col-xs-6'>{specificArticleData.userNickname}</div>
                <div className='col-sm-1 col-xs-12'><span className="label label-primary">{specificArticleData.category}</span></div>
                <div className={'col-sm-3 col-xs-12' + styles.techStyle}>{ "Object.keys(specificArticleData.technologies[0]).map(key => specificArticleData.technologies[0][key])" }</div>
                <div className={'col-sm-8 col-xs-12' + styles.dateStyle}>{specificArticleData.timeFormatted}</div>
                <div className={'col-sm-12 col-xs-12'}><div dangerouslySetInnerHTML={{__html: specificArticleData.markup}}></div></div>
              </div>
            </div>
          </div>
        : null
        }
      </div>
    );
  }
}
