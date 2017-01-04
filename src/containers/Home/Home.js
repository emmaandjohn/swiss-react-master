import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Well, Label } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import config from '../../config';
import Helmet from 'react-helmet';
import superagent from 'superagent';
import { push } from 'react-router-redux';

import { getUser } from '../../redux/actions/getUserActions';
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
    superagent
    .post('/getSpecificArticle')
    .send({ artId: id })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.props.dispatch(push('community/'+res.body.specificArticleData.urlFriendlyTitel));
      }
    });
  }


  render() {
    const styles = require('./Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');
    const stylesCommunity = require('../Community/Community.scss');
    const { getBlogEntriesState } = this.props;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = []; let whichCategory = '';
    getBlogEntriesState.articles.forEach(function(entry){
      if(entry.category === 'Projekt'){
        whichCategory = 'label-primary';
      }else{
        whichCategory = 'label-info';
      }
      blogContentDef.push(
        <div onClick={() => this.loadArticle(entry.articleId)} className={styles.topLine + ' animated fadeIn col-xs-12 ' + styles.hover}>
          <div className='row'>
            <div className='col-sm-1 col-xs-12'>
              <div className={stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              <div className={stylesMyProfile['flag'+entry.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
            </div>
            <div className={'col-sm-2 col-xs-12 ' + styles.mt5}>{entry.userNickname}</div>
            <div className='col-sm-3 col-xs-12 ' + styles.mt5}><strong>{entry.titel}</strong></div>
            <div className='col-sm-1 col-xs-12 ' + styles.mt5}><span className={'label ' + whichCategory + ' ' + styles.lwidth}>{entry.category}</span></div>
            <div className={'col-sm-3 col-xs-12 ' + styles.techStyle + ' ' + styles.mt5}>{ Object.keys(entry.technologies[0]).map(key => entry.technologies[0][key].length > 1 ? <span title={entry.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null ) }</div>
            <div className={'col-sm-2 col-xs-12 text-right ' + styles.dateStyle + ' ' + styles.mt5}>{entry.timeFormatted}</div>
          </div>
        </div>
      );
    }.bind(this));

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p className="animated flip">
                <img src={logoImage}/>
              </p>
            </div>
              <h1 className="animated fadeIn">{config.app.title}</h1>
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
