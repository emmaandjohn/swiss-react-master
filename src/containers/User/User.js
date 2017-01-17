import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button, Modal, Alert } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import Loader from 'react-loader-advanced';
import { push } from 'react-router-redux';

/* Import here only for Dispatchers */
import { syncUserData } from '../../redux/actions/syncUserDataActions';
import { getUser } from '../../redux/actions/getUserActions';
import { updateUser } from '../../redux/actions/updateUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';
import { getUserContent } from '../../redux/actions/getUserContentActions';
import { msgBox } from '../../redux/actions/msgBoxActions';

@connect((store) => {
  return {
    syncUserDataState: store.syncUserData.userList,
    getUserState: store.getUser.user,
    updateUserState: store.updateUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
    getUserContentState: store.getUserContent.articleList,
  };
})

export default class User extends Component {

  componentDidMount() {
    //let syncUserUuid = cookie.load('ck_uuid');
    let getNicknameUrl = this.props.params.nickname;
    console.log("getNicknameUrl: "+getNicknameUrl);

    //if(cookie.load('ck_tempUserID') !== 'false'){syncUserUuid = cookie.load('ck_tempUserID'); }

    superagent
    .post('/syncUserData2')
    .send({ nicknameUrl: getNicknameUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        console.log("11: "+JSON.stringify(res.body.userDataSync));
        this.props.dispatch(syncUserData(res.body.userDataSync));
      }
    });

    /* get Articles and Projects from the User */
    superagent
    .post('/getUserContent2')
    .send({ nicknameUrl: getNicknameUrl })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        console.log("22: "+JSON.stringify(res.body.blogArticles));
        this.props.dispatch(getUserContent(res.body.blogArticles));
      }
    });
  }

  state = {
    formStatus: 0,
    formMsg: ''
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

  goToCommunity = () => {
    this.props.dispatch(push('community/'));
  }


  render() {
    const { syncUserDataState, getUserState, getUserContentState, activateNewUserState, updateUserState } = this.props;
    const { formStatus, formMsg } = this.state;
    const styles = require('./User.scss');
    const stylesHome = require('../Home/Home.scss');
    const stylesCommunity = require('../Community/Community.scss');

    let syncEmail = syncUserDataState.userdata.email;
    let syncPw = syncUserDataState.userdata.password;
    let syncBirthday = syncUserDataState.userdata.birthday;
    let syncAvatar = syncUserDataState.userdata.avatar;
    let syncNickname = syncUserDataState.userdata.nickname;
    let syncJob = syncUserDataState.userdata.job;
    let syncCompany = syncUserDataState.userdata.company;
    let syncDescription = syncUserDataState.userdata.description;
    let syncMembersince = syncUserDataState.userdata.membersince;
    let syncKanton = syncUserDataState.userdata.kanton;
    let syncSfb = syncUserDataState.userdata.socialFb;
    let syncSgithub = syncUserDataState.userdata.socialGithub;
    let syncStwitter = syncUserDataState.userdata.socialTwitter;
    let syncSxing = syncUserDataState.userdata.socialXing;
    let syncSwebsite = syncUserDataState.userdata.socialWebsite;
    let syncActivation = syncUserDataState.userdata.activation;

    let objectSelector = 'avatar'+syncAvatar;
    let avatarClass = styles[objectSelector];

    let objectSelectorFlag = 'flag'+syncKanton;
    let flagClass = styles[objectSelectorFlag];

    let getNickname = syncNickname;
    if(typeof getNickname === 'undefined' || !getNickname){getNickname = 'noob';}

    let getJob = syncJob;
    let getCompany = syncCompany;
    let getBirthday = syncBirthday;

    let getDescription = syncDescription;
    if(getDescription === null){getDescription = 'Keine Angabe';}

    let getSocialGithub = syncSgithub;
    let getSocialFb = syncSfb;
    let getSocialTwitter = syncStwitter;
    let getSocialXing = syncSxing;
    let getSocialWebsite = syncSwebsite;

    console.log("getNickname: "+getNickname + syncNickname);


    /* list Articles and Projects from the User */
    let UserContentProjekte = []; let UserContentArtikel = [];
    getUserContentState.articles.forEach(function(entry){
      if(entry.category === 'Projekt'){
        UserContentProjekte.push(
          <div onClick={() => this.loadArticle(entry.articleId)} className={stylesHome.topLine + ' col-xs-12 ' + styles.col00 + ' ' + stylesHome.hover}>
              <div className='col-xs-2 col-sm-1'>
                <div className={avatarClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain + ' ' + styles.avatarMiniProfile}></div>
              </div>
              <div className={'col-xs-10 col-sm-11' + ' ' + styles.wellLayouting}>
                <div className={'col-xs-12 ' + styles.m5}>{entry.titel}</div>
                <div className={'col-xs-12 ' + stylesHome.dateStyle + ' ' + styles.m5}>{entry.timeFormatted}</div>
                <div className={'col-xs-12 ' + stylesHome.techStyle}>{ Object.keys(entry.technologies[0]).map(key => entry.technologies[0][key].length > 1 ? <span title={entry.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null ) }</div>
              </div>
          </div>
        );
      } else{
        UserContentArtikel.push(
          <div onClick={() => this.loadArticle(entry.articleId)} className={stylesHome.topLine + ' col-xs-12 ' + styles.col00 + ' ' + stylesHome.hover}>
              <div className='col-xs-2 col-sm-1'>
                <div className={avatarClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain + ' ' + styles.avatarMiniProfile}></div>
              </div>
              <div className={'col-xs-10 col-sm-11' + ' ' + styles.wellLayouting}>
                <div className={'col-xs-12 ' + styles.m5}>{entry.titel}</div>
                <div className={'col-xs-12 ' + stylesHome.dateStyle + ' ' + styles.m5}>{entry.timeFormatted}</div>
                <div className={'col-xs-12 ' + stylesHome.techStyle}>{ Object.keys(entry.technologies[0]).map(key => <span title={entry.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span>) }</div>
              </div>
          </div>
        );
      }
    }.bind(this));

    return (

        <div className={styles.myprofilePage + ' container profilepage'}>
          <Helmet title="User"/>
          { getNickname !== 'noob' ?
              <Row>
                <Col xs={12}>
                  <h1>{getNickname}</h1>
                  <hr />
                </Col>

                <Col className={styles.mb35} xs={12} sm={6}>
                    <Col xs={12}>
                      <Row>
                        <Col xs={4}>
                          <div className={avatarClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain}></div>
                        </Col>
                      </Row>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}>Mitglied seit</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>{syncMembersince}</Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}>Job</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getJob === null ? 'Keine Angabe' : getJob}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}>Firma</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getCompany === null ? 'Keine Angabe' : getCompany}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}>Geburtstag</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getBirthday === null ? 'Keine Angabe' : getBirthday}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}><i className={"fa fa-github " + styles.famr16} aria-hidden="true"></i> Github</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getSocialGithub === null ? 'Keine Angabe' : getSocialGithub}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}><i className={"fa fa-facebook " + styles.famr16} aria-hidden="true"></i> Facebook</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getSocialFb === null ? 'Keine Angabe' : getSocialFb}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}><i className={"fa fa-twitter " + styles.famr16} aria-hidden="true"></i> Twitter</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getSocialTwitter === null ? 'Keine Angabe' : getSocialTwitter}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}><i className={"fa fa-xing " + styles.famr16} aria-hidden="true"></i> Xing</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getSocialXing === null ? 'Keine Angabe' : getSocialXing}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} sm={4} xs={12}><i className={"fa fa-globe " + styles.famr16} aria-hidden="true"></i> Website</Col>
                    <Col className={styles.m15v2 + ' ' + styles.topLine2} sm={8} xs={12}>
                        <div>{getSocialWebsite === null ? 'Keine Angabe' : getSocialWebsite}</div>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={12}>Über dich</Col>
                    <Col className={styles.m15 + ' ' + styles.pb20border} xs={12}>
                        <div className={styles.makeItalic + ' ' + styles.whiteSpacePreWrap}>{getDescription}</div>
                    </Col>
              </Col>

              <Col className={styles.mb35} xs={12} sm={6}>
                <Col xs={12}>
                  <Row>
                    <Col xs={4}>
                      <div className={flagClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain}></div>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.m15 + ' well ' + styles.topLine} xs={12}>
                  <h3 className={styles.categoryTitle + ' ' + styles.categoryTitlePro}><span className={styles.logoBrand}/> Projekte</h3>
                  <Row>
                    {UserContentProjekte.length < 1 ? <Col xs={12} className={styles.makeItalic}>Noch keine Projekte</Col> : UserContentProjekte}
                  </Row>
                </Col>
                <Col className={styles.m15 + ' well ' + styles.topLine} xs={12}>
                  <h3 className={styles.categoryTitle + ' ' + styles.categoryTitleArt}><span className={styles.logoBrand}/> Artikel</h3>
                  <Row>
                    {UserContentArtikel.length < 1 ? <Col xs={12} className={styles.makeItalic}>Noch keine Artikel</Col> : UserContentArtikel}
                  </Row>
                </Col>
              </Col>
            </Row>
        :
          <div><br /><br /><p>Hoppla! Gemäss Swiss-React-Reglement, zeigen wir keine Detailseiten von Usern welche ihren Usernamen vom Default-Wert -> <strong>noob</strong> nicht abgeändert haben.</p></div>
        }
        </div>
    );
  }

}
