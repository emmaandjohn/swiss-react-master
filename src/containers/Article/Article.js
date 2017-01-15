import React, {Component} from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';

import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Link } from 'react-router';

import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';
import { msgBox } from '../../redux/actions/msgBoxActions';

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
    specificArticleTechData: '',
    artDeleteStatus: false
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
        let sadData = Object.keys(this.state.specificArticleData.technologies[0]).map(key => this.state.specificArticleData.technologies[0][key].length > 1 ? <span title={this.state.specificArticleData.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null );
        this.setState({ specificArticleTechData: sadData });
      } else{
        console.log("Error, Article url does not exist in DB");
      }
    });
  }

  checkProfile = (id, nickname) => {
    cookie.save('ck_tempUserID', id, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
    this.props.dispatch(push('/user/'+nickname));
  }

  editArticle = (id) => {
    cookie.save('ck_tempEditArt', id, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
    this.props.dispatch(push('/community'));
  }

  deleteArticle = () => {
    this.setState({ artDeleteStatus: true });
  }

  deleteArticleRevert = () => {
    this.setState({ artDeleteStatus: false });
  }

  deleteArticleDef = (deleteArticleID) => {
    superagent
    .post('/deleteArticle')
    .send({ deleteArticleID: deleteArticleID })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.props.dispatch(push('/meinprofil'));
        scroll(0,0);
        this.props.dispatch(msgBox(true, 'Der Artikel wurde erfolgreich gelöscht! <u class="cpointer">Schliessen</u>'));
      }
    });
  }

  render() {
    const stylesArticle = require('./Article.scss');
    const styles = require('../Home/Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');

    const {artDeleteStatus, formStatus, formMsg, specificArticleData, specificArticleTechData} = this.state;
    const { activateNewUserState, getBlogEntriesState} = this.props;

    return (
      <div className="container" id="articlePage">
        <Helmet title={specificArticleData.titel}/>
          <div className='row'>
            <div className={'col-xs-12'}>
              <div className='row'>
                <div className={'col-xs-12 ' + styles.pb20}>
                  <h1 className={stylesArticle.hyphens}><span className={stylesArticle.h1BtnStyle}>{specificArticleData.titel + ' '}</span>
                    { specificArticleData.userUuid === cookie.load('ck_uuid') ?
                      <span>
                        <button className={"btn btn-primary " + stylesArticle.mr5} onClick={() => this.editArticle(specificArticleData.articleId)}>Deinen Beitrag bearbeiten</button>
                        { artDeleteStatus === false ?
                          <button className={"btn btn-default " + stylesArticle.btnDelete} onClick={() => this.deleteArticle()}><i className="fa fa-remove" aria-hidden="true"></i> Beitrag löschen</button>
                        :
                          <span>
                            <button className={"btn btn-default " + stylesArticle.btnDelete} onClick={() => this.deleteArticleDef(specificArticleData.articleId)}>Wirklich löschen?</button>
                            <button className={"btn btn-default " + stylesArticle.btnDelete} onClick={() => this.deleteArticleRevert()}><i className="fa fa-remove" aria-hidden="true"></i></button>
                          </span>
                        }
                      </span>
                    : null
                    }
                  </h1>
                </div>
                <div className='col-sm-3 col-xs-12 cpointer' onClick={() => this.checkProfile(specificArticleData.userUuid, specificArticleData.userNickname)}>
                  <div className={stylesMyProfile['avatar'+specificArticleData.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                  <div className={stylesMyProfile['flag'+specificArticleData.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                </div>
                <div className='col-sm-9 col-xs-12'>
                  <div className={'col-xs-12 ' + stylesArticle.pb7 + ' ' + stylesArticle.mt20m}>Autor: <strong>{specificArticleData.userNickname}</strong></div>
                  <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.pb7}>{specificArticleTechData}</div>
                  <div className={'col-xs-12 ' + styles.dateStyle + ' ' + styles.topLine + ' ' + styles.pb40}>Beitrag vom: {specificArticleData.timeFormatted} | Kategorie: <strong>{specificArticleData.category}</strong></div>
                </div>
                <div className={'col-xs-12 ' + ' ' + styles.topLine}><div dangerouslySetInnerHTML={{__html: specificArticleData.markup}}></div></div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
