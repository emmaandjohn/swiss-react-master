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
    formMsg: ''
  }

  render() {
    const styles = require('../Home/Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');

    const {formStatus, formMsg} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;

    console.log(JSON.stringify(getBlogEntriesState));

    let blogContentDef = [];
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef.push(
        <div className={styles.topLine + ' col-xs-12'}>
          <div className='col-xs-1'>
            <div className={stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
          </div>
          <div className='col-xs-2'>{entry.userNickname}</div>
          <div className='col-xs-3'><strong>{entry.titel}</strong></div>
          <div className='col-xs-1'><span className="label label-primary">{entry.category}</span></div>
          <div className={'col-xs-3 ' + styles.techStyle}>{entry.technologies}</div>
          <div className={'col-xs-2 ' + styles.dateStyle}>{entry.timeFormatted}</div>
          <div className={'col-xs-12'}>{entry.markup}</div>
        </div>
      );
    }.bind(this));

    //let blogContentDef = '';
    // Todo: make it JSX style not like this.. see Home.js for sample.
    // And of course get here specific Article from the blog-ID in updated STATE from Home.js
    /*getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;"><h2 style="color: #d52b1e;">' + entry.titel + '</h2><hr />' + entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' + entry.userNickname + ' | ' + entry.timeFormatted + '</span></div>';
    });*/

    return (
      <div className="container" id="articlePage">
        <Helmet title="Article"/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
          <div className='row'>
            {blogContentDef}
          </div>
        : null
        }
      </div>
    );
  }
}
