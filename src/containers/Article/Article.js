import React, {Component} from 'react';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';
import { Well, Alert, Button } from 'react-bootstrap/lib';

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
    artDeleteStatus: false,
    r01: false, r02: false, r03: false, r04: false, r05: false, r06: false,
    ratedRadio: null
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
        let sadData = Object.keys(this.state.specificArticleData.technologies[0]).map(key => this.state.specificArticleData.technologies[0][key].length > 1 ? <span title={this.state.specificArticleData.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null );
        this.setState({ specificArticleTechData: sadData });
      } else{
        console.log("Error, Article url does not exist in DB");
      }
    });
  }

  rateOrComment = (category, rateOrCommentValue, targetArticleId, targetUuid) => {
    let commentersUuid = cookie.load('ck_uuid');
    let commentersAvatar = cookie.load('ck_avatar');
    let commentersKanton = cookie.load('ck_kanton');
    let commentersNickname = cookie.load('ck_nickname');
    let commentersNicknameUrl = cookie.load('ck_nicknameUrl');

    let checkCode = 1;
    if(category === 'comment'){
      if(rateOrCommentValue.length < 3){
        this.setState({formStatus: 1});
        this.setState({formMsg: 'Fehler: Dein Kommentar ist zu kurz, verfasse mindestens 3 Zeichen!'});
        checkCode = 0;
      }
      if(rateOrCommentValue.length > 1000){
        this.setState({formStatus: 1});
        this.setState({formMsg: 'Fehler: Dein Kommentar ist leider etwas zu lange! Kommentare sollten 1000 Zeichen nicht überschreiten!'});
        checkCode = 0;
      }
    }
    if(category === 'rate'){
      if(rateOrCommentValue.length < 1){
        this.setState({formStatus: 2});
        this.setState({formMsg: 'Fehler: Keine Reaction ausgewählt!'});
        checkCode = 0;
      }
    }

    if(checkCode === 1){
      superagent
      .post('/rateOrComment')
      .send({ category: category, rateOrCommentValue: rateOrCommentValue, targetArticleId: targetArticleId, targetUuid: targetUuid, commentersUuid: commentersUuid, commentersAvatar: commentersAvatar, commentersKanton: commentersKanton, commentersNickname: commentersNickname, commentersNicknameUrl: commentersNicknameUrl })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if(res.body.status === 1) {
          console.log("Success, dispatch Action here to reload Comments/Ratings..");
        } else{
          console.log("Error, rateOrComment");
        }
      });
    }
  }

  checkProfile = (nicknameUrl) => {
    this.props.dispatch(push('/user/'+nicknameUrl));
  }

  editArticle = (id) => {
    cookie.save('ck_tempEditArt', id, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
    this.props.dispatch(push('/community'));
  }

  onChangeRadio = (event, rValue) => {
    if(rValue === 'r01'){ this.setState({ r01: true, r02: false, r03: false, r04: false, r05: false, r06: false }); this.setState({ ratedRadio: rValue }); }
    if(rValue === 'r02'){ this.setState({ r01: false, r02: true, r03: false, r04: false, r05: false, r06: false }); this.setState({ ratedRadio: rValue }); }
    if(rValue === 'r03'){ this.setState({ r01: false, r02: false, r03: true, r04: false, r05: false, r06: false }); this.setState({ ratedRadio: rValue }); }
    if(rValue === 'r04'){ this.setState({ r01: false, r02: false, r03: false, r04: true, r05: false, r06: false }); this.setState({ ratedRadio: rValue }); }
    if(rValue === 'r05'){ this.setState({ r01: false, r02: false, r03: false, r04: false, r05: true, r06: false }); this.setState({ ratedRadio: rValue }); }
    if(rValue === 'r06'){ this.setState({ r01: false, r02: false, r03: false, r04: false, r05: false, r06: true }); this.setState({ ratedRadio: rValue }); }
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

    const {artDeleteStatus, formStatus, formMsg, specificArticleData, specificArticleTechData, ratedRadio} = this.state;
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
                <div className='col-sm-3 col-xs-12 cpointer' onClick={() => this.checkProfile(specificArticleData.nicknameUrl)}>
                  <div className={stylesMyProfile['avatar'+specificArticleData.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                  <div className={stylesMyProfile['flag'+specificArticleData.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain}></div>
                </div>
                <div className='col-sm-9 col-xs-12'>
                  <div className={'col-xs-12 ' + stylesArticle.pb7 + ' ' + stylesArticle.mt20m}>Autor: <strong>{specificArticleData.userNickname}</strong></div>
                  <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.pb7}>{specificArticleTechData}</div>
                  <div className={'col-xs-12 ' + styles.dateStyle + ' ' + styles.topLine + ' ' + styles.pb40}>Beitrag vom: {specificArticleData.timeFormatted} | Kategorie: <strong>{specificArticleData.category}</strong></div>
                </div>
                <div className={'col-xs-12 ' + styles.topLine}><div dangerouslySetInnerHTML={{__html: specificArticleData.markup}}></div><br /><br /></div>
                <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc + ' ' + stylesArticle.pt35}>
                    <br /><br /><br />
                    <span className={stylesArticle.italic}><strong>Reactionen</strong></span>
                    {formStatus === 2 ?
                      <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
                    : null
                    }
                    <p>Wie findest du diesen Beitrag? Sende dem Autor deine Reaction!</p>
                      <fieldset>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r01} type="radio" onChange={(event) => this.onChangeRadio(event, 'r01')} ref="r01" id="r01" value="r01" />
                        </label>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r02} type="radio" onChange={(event) => this.onChangeRadio(event, 'r02')} ref="r02" id="r02" value="r02" />
                        </label>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r03} type="radio" onChange={(event) => this.onChangeRadio(event, 'r03')} ref="r03" id="r03" value="r03" />
                        </label>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r04} type="radio" onChange={(event) => this.onChangeRadio(event, 'r04')} ref="r04" id="r04" value="r04" />
                        </label>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r05} type="radio" onChange={(event) => this.onChangeRadio(event, 'r05')} ref="r05" id="r05" value="r05" />
                        </label>
                        <label className={'checkbox-inline'}>
                          <input checked={this.state.r06} type="radio" onChange={(event) => this.onChangeRadio(event, 'r06')} ref="r06" id="r06" value="r06" />
                        </label>
                      </fieldset>
                      <button className={"btn btn-default " + stylesArticle.btnDelete + ' ' + stylesArticle.btnPaddings} onClick={() => this.rateOrComment('rate', ratedRadio, specificArticleData.articleId, specificArticleData.userUuid)}>Sende Reaction</button>
                </div>
                <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc}>
                    <p>List all existing Reactions here...</p>
                </div>
                <br />
                <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc + ' ' + stylesArticle.pt35}>
                    <span className={stylesArticle.italic}><strong>Kommentare</strong></span>
                    {formStatus === 1 ?
                      <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
                    : null
                    }
                    <textarea name="comment" ref="comment" placeholder="Dein Kommentar..." className={'form-control ' + stylesMyProfile.fixTextarea}></textarea>
                    <button className={"btn btn-default " + stylesArticle.btnDelete + ' ' + stylesArticle.btnPaddings} onClick={() => this.rateOrComment('comment', this.refs.comment.value, specificArticleData.articleId, specificArticleData.userUuid)}>Kommentar posten</button>
                </div>
                <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc}>
                    <p>List all existing Comments here...</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
