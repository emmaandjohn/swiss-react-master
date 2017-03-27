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
import { getRateEntries } from '../../redux/actions/getRateEntriesActions';
import { getCommentEntries } from '../../redux/actions/getCommentEntriesActions';
import { msgBox } from '../../redux/actions/msgBoxActions';

@connect((store) => {
  return {
    activateNewUserState: store.activateNewUser.userStatus,
    getBlogEntriesState: store.getBlogEntries.articleList,
    getRateEntriesState: store.getRateEntries.articleList,
    getCommentEntriesState: store.getCommentEntries.articleList,
  };
})

export default class Article extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    formStatusRoC: 0,
    formMsgRoC: '',
    specificArticleData: {},
    specificArticleTechData: '',
    artDeleteStatus: false,
    r01: false, r02: false, r03: false, r04: false, r05: false, r06: false,
    ratedRadio: null
  }

  componentDidMount() {
    let getUrl = this.props.params.id;
    const stylesCommunity = require('../Community/Community.scss');

    // Get Specific Article + get depending rates + comments
    superagent
    .post('/getSpecificArticleWithUrl')
    .send({ urlFriendly: getUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.setState({specificArticleData: res.body.specificArticleData});
        let sadData = Object.keys(this.state.specificArticleData.technologies[0]).map(key => this.state.specificArticleData.technologies[0][key].length > 1 ? <span title={this.state.specificArticleData.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null );
        this.setState({ specificArticleTechData: sadData });

        if(res.body.rateData !== '0'){
          this.props.dispatch(getRateEntries(res.body.rateData));
        }
        if(res.body.commentData !== '0'){
          this.props.dispatch(getCommentEntries(res.body.commentData));
        }

      } else{
        console.log("Error, Article url does not exist in DB");
      }
    });

  }

  updateRoC = () => {
    let getUrl = this.props.params.id;

    // Get depending rates + comments
    superagent
    .post('/getSpecificArticleWithUrl')
    .send({ urlFriendly: getUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        if(res.body.rateData !== '0'){
          this.props.dispatch(getRateEntries(res.body.rateData));
          this.setState({ r01: false, r02: false, r03: false, r04: false, r05: false, r06: false }); this.setState({ ratedRadio: null });
        }
        if(res.body.commentData !== '0'){
          this.props.dispatch(getCommentEntries(res.body.commentData));
          this.refs.comment.value = '';
        }
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
      if(rateOrCommentValue === null){
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
          this.updateRoC();
        }
      });
    }
  }

  checkProfile = (nicknameUrl) => {
    this.props.dispatch(push('/user/'+nicknameUrl));
  }
  becomeMember = () => {
    this.props.dispatch(push('/registrieren/'));
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
    const { activateNewUserState, getBlogEntriesState, getRateEntriesState, getCommentEntriesState} = this.props;

    let rateContentDef = []; let commentContentDef = [];
    let ratingVal1 = 0; let ratingVal2 = 0; let ratingVal3 = 0; let ratingVal4 = 0; let ratingVal5 = 0; let ratingVal6 = 0;
    let nicks1 = ''; let nicks2 = ''; let nicks3 = ''; let nicks4 = ''; let nicks5 = ''; let nicks6 = '';

    getRateEntriesState.articles.forEach(function(entry){
      if(entry.rateOrCommentValue === 'r01'){ ratingVal1 += 1; nicks1 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
      if(entry.rateOrCommentValue === 'r02'){ ratingVal2 += 1; nicks2 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
      if(entry.rateOrCommentValue === 'r03'){ ratingVal3 += 1; nicks3 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
      if(entry.rateOrCommentValue === 'r04'){ ratingVal4 += 1; nicks4 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
      if(entry.rateOrCommentValue === 'r05'){ ratingVal5 += 1; nicks5 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
      if(entry.rateOrCommentValue === 'r06'){ ratingVal6 += 1; nicks6 += (entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname)+', ';}
    }.bind(this));

    if(nicks1.length > 1){nicks1 = nicks1.slice(0, -2);}
    if(nicks2.length > 1){nicks2 = nicks2.slice(0, -2);}
    if(nicks3.length > 1){nicks3 = nicks3.slice(0, -2);}
    if(nicks4.length > 1){nicks4 = nicks4.slice(0, -2);}
    if(nicks5.length > 1){nicks5 = nicks5.slice(0, -2);}
    if(nicks6.length > 1){nicks6 = nicks6.slice(0, -2);}

    rateContentDef.push(
      <div className={styles.topLine + ' animated fadeIn col-xs-12'}>
        <div className='row'>
          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>Crap! <i className={"fa fa-trash fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal1}</strong> (<i>{nicks1}</i>)
          </div>

          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>WTF! <i className={"fa fa-warning fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal2}</strong> (<i>{nicks2}</i>)
          </div>

          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>Cool! <i className={"fa fa-thumbs-up fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal3}</strong> (<i>{nicks3}</i>)
          </div>

          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>Awesome! <i className={"fa fa-star fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal4}</strong> (<i>{nicks4}</i>)
          </div>

          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>Dope Shit! <i className={"fa fa-trophy fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal5}</strong> (<i>{nicks5}</i>)
          </div>

          <div className={'col-xs-6 col-sm-3 ' + styles.mt5 + ' ' + styles.oh}>
            <span>God Mode! <i className={"fa fa-university fa-3 " + stylesArticle.faColor} aria-hidden="true"></i>: </span>
          </div>
          <div className={'col-xs-6 col-sm-9 ' + styles.mt5 + ' ' + styles.oh}>
            <strong>{ratingVal6}</strong> (<i>{nicks6}</i>)
          </div>

        </div>
      </div>
    );

    getCommentEntriesState.articles.forEach(function(entry){
      commentContentDef.push(
        <div className={styles.topLine + ' animated fadeIn col-xs-12'}>
          <div className='row'>
            <div onClick={() => this.checkProfile(entry.commentersNicknameUrl)} className={'cpointer col-sm-1 col-xs-4 ' + styles.mt5 + ' ' + styles.mr35minus}>
              <div className={stylesMyProfile['avatar'+entry.commentersAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              <div className={stylesMyProfile['flag'+entry.commentersKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
            </div>
            <div className={'col-sm-11 col-xs-8 ' + styles.mt5 + ' ' + styles.oh}>{entry.commentersNickname === 'null' ? 'noob' : entry.commentersNickname}</div>
            <div className={'col-xs-12 ' + styles.mt5 + ' ' + styles.oh}>{entry.rateOrCommentValue}</div>
            <div className={'col-xs-12 ' + styles.dateStyle + ' ' + styles.mt5 + ' ' + styles.mb10}>{entry.commentersTimestamp}</div>
          </div>
        </div>
      );
    }.bind(this));

    return (
      <div className="container" id="articlePage">
        <Helmet title={specificArticleData.titel}/>
          <div className='row'>
            <div className={'col-xs-12'}>
              <div className='row'>
                <div className={'col-xs-12 ' + styles.pb20}>
                  <h1 className={stylesArticle.hyphens}><span className={stylesArticle.h1BtnStyle}>{specificArticleData.titel + ' '}</span>
                  {(specificArticleData.userUuid === cookie.load('ck_uuid')) && ((activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true')) ?
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
                    {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
                    null
                    :
                    <span>
                      <button className={"btn btn-primary " + stylesArticle.mr5} onClick={() => this.becomeMember()}>Join Swiss React Community!</button>
                    </span>
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

                {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
                <div>
                  <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc + ' ' + stylesArticle.pt35}>
                      <br /><br /><br />
                      <span className={stylesArticle.italic}><strong>Reactionen</strong></span>
                      {(specificArticleData.userUuid !== cookie.load('ck_uuid')) ?
                      <div>
                        {formStatus === 2 ?
                          <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
                        : null
                        }
                        <p>Wie findest du diesen Beitrag? Sende dem Autor deine Reaction!</p>
                          <fieldset>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r01} type="radio" onChange={(event) => this.onChangeRadio(event, 'r01')} ref="r01" id="r01" value="r01" />
                              <span> Crap! <i className={"fa fa-trash fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r02} type="radio" onChange={(event) => this.onChangeRadio(event, 'r02')} ref="r02" id="r02" value="r02" />
                              <span> WTF! <i className={"fa fa-warning fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r03} type="radio" onChange={(event) => this.onChangeRadio(event, 'r03')} ref="r03" id="r03" value="r03" />
                              <span> Cool! <i className={"fa fa-thumbs-up fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r04} type="radio" onChange={(event) => this.onChangeRadio(event, 'r04')} ref="r04" id="r04" value="r04" />
                              <span> Awesome! <i className={"fa fa-star fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r05} type="radio" onChange={(event) => this.onChangeRadio(event, 'r05')} ref="r05" id="r05" value="r05" />
                              <span> Dope Shit! <i className={"fa fa-trophy fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                            <label className={'checkbox-inline ' + stylesArticle.pn}>
                              <input checked={this.state.r06} type="radio" onChange={(event) => this.onChangeRadio(event, 'r06')} ref="r06" id="r06" value="r06" />
                              <span> God Mode! <i className={"fa fa-university fa-3 " + stylesArticle.faColor} aria-hidden="true"></i></span>
                            </label>
                          </fieldset>
                          <button className={"btn btn-primary " + stylesArticle.btnPaddings} onClick={() => this.rateOrComment('rate', ratedRadio, specificArticleData.articleId, specificArticleData.userUuid)}>Sende Reaction</button>
                      </div>
                      : null
                      }
                </div>
                <div className={'col-xs-12 ' + stylesArticle.roc}>
                      {rateContentDef}
                </div>
                <br />
                <div className={'col-xs-12 ' + styles.topLine + ' ' + stylesArticle.roc + ' ' + stylesArticle.pt35}>
                      <br /><br /><br />
                      <span className={stylesArticle.italic}><strong>Kommentare</strong></span>
                      {formStatus === 1 ?
                        <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
                      : null
                      }
                      <textarea name="comment" ref="comment" placeholder="Dein Kommentar..." className={'form-control ' + stylesMyProfile.fixTextarea}></textarea>
                      <button className={"btn btn-primary " + stylesArticle.btnPaddings} onClick={() => this.rateOrComment('comment', this.refs.comment.value, specificArticleData.articleId, specificArticleData.userUuid)}>Kommentar posten</button>
                </div>
                <div className={'col-xs-12 ' + stylesArticle.roc}>
                    {commentContentDef}
                </div>
              </div>
                :
                null }
              </div>
            </div>
          </div>
      </div>
    );
  }
}
