import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Well, Label } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import config from '../../config';
import Helmet from 'react-helmet';
import superagent from 'superagent';
import { push } from 'react-router-redux';

import { getUser } from '../../redux/actions/getUserActions';
import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';
import { getUserEntries } from '../../redux/actions/getUserEntriesActions';

@connect((store) => {
  return {
    getBlogEntriesState: store.getBlogEntries.articleList,
    getUserEntriesState: store.getUserEntries.articleList,
  };
})

export default class Home extends Component {
  state = {
    showSpinner: 1,
    showSpinner2: 1
  }

  componentDidMount() {
    this.setState({showSpinner: 1}); this.setState({showSpinner2: 1});
    /* get newest articles */
    superagent
    .post('/community')
    .send({ loadStatus: 2 })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.setState({showSpinner: 0});
        this.props.dispatch(getBlogEntries(res.body.blogArticles));
      }
    });
    /* get newest users */
    superagent
    .post('/getNewestUsers')
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.setState({showSpinner2: 0});
        this.props.dispatch(getUserEntries(res.body.userArticles));
      }
    });
  }

  static propTypes = {
    userLoggedIn: PropTypes.string
  }


  checkProfile = (nicknameUrl) => {
    this.props.dispatch(push('/user/'+nicknameUrl));
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

  goToSearch = () => {
    this.props.dispatch(push('suche/'));
  }


  render() {
    const styles = require('./Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');
    const stylesCommunity = require('../Community/Community.scss');
    const stylesSuche = require('../Suche/Suche.scss');
    const { getBlogEntriesState, getUserEntriesState } = this.props;
    const {showSpinner, showSpinner2} = this.state;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = []; let userContentDef = [];
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef.push(
        <div onClick={() => this.loadArticle(entry.articleId)} className={styles.topLine + ' animated fadeIn col-xs-12 ' + styles.hover}>
          <div>
            <div className={'col-sm-1 col-xs-4 ' + styles.mt5 + ' ' + styles.mr35minus}>
              <div className={stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              <div className={stylesMyProfile['flag'+entry.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
            </div>
            <div className={'col-sm-2 col-xs-8 ' + styles.mt5 + ' ' + styles.oh}>{entry.userNickname}</div>
            <div className={'col-sm-4 col-xs-12 ' + styles.mt5 + ' ' + styles.oh + ' ' + styles.fs18}><strong>{entry.titel}</strong></div>
            <div className={'col-sm-3 col-xs-12 ' + styles.techStyle + ' ' + styles.mt5}>{ Object.keys(entry.technologies[0]).map(key => entry.technologies[0][key].length > 1 ? <span title={entry.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null ) }</div>
            <div className={'col-sm-2 col-xs-12 text-right ' + styles.dateStyle + ' ' + styles.mt5 + ' ' + styles.mb10}>{entry.timeFormatted} | <strong>{entry.category}</strong></div>
          </div>
        </div>
      );
    }.bind(this));

    blogContentDef.push(
      <div className={'text-center col-xs-12'}>
        <button className={"btn btn-primary " + stylesSuche.search2button + ' ' + styles.mt45} onClick={() => this.goToSearch()}>Mehr Beiträge / Suche</button>
      </div>
    );

    getUserEntriesState.articles.forEach(function(entry){
      userContentDef.push(
        <div onClick={() => this.checkProfile(entry.nicknameUrl)} className={'animated well cpointer fadeIn col-xs-12 col-sm-4 ' + styles.hover + ' ' + styles.pm0}>
          <div>
            <div className={'col-xs-12 ' + styles.mt5 + ' ' + styles.mr35minus}>
              <div className={stylesMyProfile['avatar'+entry.avatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              <div className={stylesMyProfile['flag'+entry.kanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              <div className={styles.mt5 + ' ' + styles.ml68 + ' ' + styles.oh}>{entry.nickname === null ? 'noob' : entry.nickname}</div>
            </div>
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
          <div className={'row'}>
            {showSpinner === 1 ?
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            : null
            }
            {blogContentDef}
          </div>
        </div>

        <div className='container'>
          <h3 className={styles.mb20}>Neuste User</h3>
          <div className={'row'}>
            {showSpinner2 === 1 ?
              <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            : null
            }
            {userContentDef}
          </div>
        </div>

        <div className='container'>
          <h3 className={styles.mb20}>Medien</h3>
          <div className={'row'}>
            <div className={'col-xs-4'}>
              <iframe width="320" height="180" src="https://www.youtube.com/embed/6I5SKBVIX9Q" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className={'col-xs-4'}>
              <iframe width="320" height="180" src="https://www.youtube.com/embed/MhkGQAoc7bc" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className={'col-xs-4'}>
              <iframe width="320" height="180" src="https://www.youtube.com/embed/fd2Cayhez58" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
