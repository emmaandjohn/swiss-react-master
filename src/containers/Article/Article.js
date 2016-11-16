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
    const {formStatus, formMsg} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;

    let blogContentDef = '';

    // Todo: make it JSX style not like this.. see Home.js for sample.
    // And of course get here specific Article from the blog-ID in updated STATE from Home.js
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;"><h2 style="color: #d52b1e;">' + entry.titel + '</h2><hr />' + entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' + entry.userNickname + ' | ' + entry.timeFormatted + '</span></div>';
    });

    return (
      <div className="container" id="articlePage">
        <h1>Artikel</h1>
        <Helmet title="Article"/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
          <div dangerouslySetInnerHTML={{__html: blogContentDef}}></div>
        : null
        }
      </div>
    );
  }
}
