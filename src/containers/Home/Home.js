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

  render() {
    const styles = require('./Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');
    const { getBlogEntriesState } = this.props;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = '';
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div class="col-xs-12 ' + styles.topLine + '"></div><div class="col-xs-1"><div class="' + stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini + '"></div></div>' +
                        '<div class="col-xs-3">'+ entry.userNickname + '</div>' +
                        '<div class="col-xs-2"><strong>'+ entry.titel + '</strong></div>' +
                        '<div class="col-xs-1"><span class="label label-primary">'+ entry.category + '</span></div>' +
                        '<div class="col-xs-3">'+ entry.technologies + '</div>' +
                        '<div class="col-xs-2 ' + styles.dateStyle + '">'+ entry.timeFormatted + '</div>';
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
          <h3>React Activity Feed</h3>
            <div className='row' dangerouslySetInnerHTML={{__html: blogContentDef}}></div>
        </div>
      </div>
    );
  }
}
