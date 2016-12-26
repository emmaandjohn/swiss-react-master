import React, {Component} from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';

import {bindActionCreators} from 'redux';
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
    specificArticleData: {},
    specificArticleTechData: ''
  }

  componentDidMount() {
    let getUrl = this.props.params.id;
    const stylesCommunity = require('../Community/Community.scss');

    superagent
    .post('/getSpecificArticleWithUrl')
    .send({ urlFriendly: getUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.setState({specificArticleData: res.body.specificArticleData});
        /*this.setState({ specificArticleTechData: Object.keys(this.state.specificArticleData.technologies[0]).map(
          key => this.state.specificArticleData.technologies[0][key]
        ) });*/
        this.setState({ specificArticleTechData: Object.keys(this.state.specificArticleData.technologies[0]).map(key => <span title={this.state.specificArticleData.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span>) });
      } else{
        console.log("Error, Article url does not exist in DB");
      }
    });
  }

  editArticle = (id) => {
    console.log(id);
  }


  render() {
    const stylesArticle = require('./Article.scss');
    const styles = require('../Home/Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');

    const {formStatus, formMsg, specificArticleData, specificArticleTechData} = this.state;
    const { activateNewUserState, getBlogEntriesState} = this.props;

    let whichCategory = '';
    if(specificArticleData.category === 'Projekt'){
      whichCategory = 'label-primary';
    }else{
      whichCategory = 'label-info';
    }

    return (
      <div className="container" id="articlePage">
        <Helmet title={specificArticleData.titel}/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
          <div className='row'>
            <div className={'col-xs-12'}>
              <div className='row'>
               { specificArticleData.userUuid === cookie.load('ck_uuid') ?
                 <div className={'col-xs-12 ' + styles.pb20}><button className="btn btn-primary" onClick={() => this.editArticle(specificArticleData.articleId)}>Deinen Beitrag bearbeiten</button></div>
               : null
               }
                <div className={'col-xs-12 ' + styles.pb20}><h1>{specificArticleData.titel}</h1></div>
                <div className='col-sm-3 col-xs-12'>
                  <div className={stylesMyProfile['avatar'+specificArticleData.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                  <div className={stylesMyProfile['flag'+specificArticleData.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                </div>
                <div className='col-sm-9 col-xs-12'>
                  <div className={'col-xs-12 ' + stylesArticle.pb7}>Autor: <strong>{specificArticleData.userNickname}</strong></div>
                  <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.pb7}><span className={'label ' + whichCategory + ' ' + stylesArticle.labelGeneralStyle}>{specificArticleData.category}</span> {specificArticleTechData}</div>
                  <div className={'col-xs-12 ' + styles.dateStyle + ' ' + styles.topLine + ' ' + styles.pb40}>Beitrag vom: {specificArticleData.timeFormatted}</div>
                </div>
                <div className={'col-xs-12 ' + ' ' + styles.topLine}><div dangerouslySetInnerHTML={{__html: specificArticleData.markup}}></div></div>
              </div>
            </div>
          </div>
        : null
        }
      </div>
    );
  }
}
