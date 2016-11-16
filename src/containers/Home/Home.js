import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Well, Label } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import config from '../../config';
import Helmet from 'react-helmet';
import superagent from 'superagent';

import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';

@connect((store) => {
  return {
    getBlogEntriesState: store.getBlogEntries.articleList,
  };
})

export default class Home extends Component {

  componentDidMount() {
    superagent
    .post('/community')
    .send({ loadStatus: 2 })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.props.dispatch(getBlogEntries(res.body.blogArticles));
      }
    });
  }

  static propTypes = {
    userLoggedIn: PropTypes.string
  }

  loadArticle = (id) => {
    console.log(id);
    //superagent request with /community/article-id-abc123545
    // you get back here markupdata and all other data from specific article in -> res.

    /* handle this in server.js - in saveto Mongo action:
    function convertToSlug(Text)
    {
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }
    save it to aditional field like: urlFriendlyTitel
    also new field: articleId

    then within res. you get urlFriendlyTitel -> add it here to dispatch.push:

    this.props.dispatch.push -> /community/transformed-blog-titel from server.js

    */
  }

  render() {
    const styles = require('./Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');
    const { getBlogEntriesState } = this.props;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = [];
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef.push(
        <div onClick={() => this.loadArticle('nickname')} className={styles.topLine + ' col-xs-12 ' + styles.hover}>
          <div className='col-xs-1'>
            <div className={stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
          </div>
          <div className='col-xs-2'>{entry.userNickname}</div>
          <div className='col-xs-3'><strong>{entry.titel}</strong></div>
          <div className='col-xs-1'><span className="label label-primary">{entry.category}</span></div>
          <div className={'col-xs-3 ' + styles.techStyle}>{entry.technologies}</div>
          <div className={'col-xs-2 ' + styles.dateStyle}>{entry.timeFormatted}</div>
        </div>
      );
    });

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
            <h2>{config.app.subdescription}</h2>
          </div>
        </div>

        <div className='container'>
          <h3 className={styles.mb20}>React Activity Feed</h3>
          <div className='row'>
            {blogContentDef}
          </div>
        </div>
      </div>
    );
  }
}
