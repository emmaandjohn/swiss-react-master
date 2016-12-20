import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button, Modal, Alert } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import Loader from 'react-loader-advanced';

/* Import here only for Dispatchers */
import { syncUserData } from '../../redux/actions/syncUserDataActions';
import { getUser } from '../../redux/actions/getUserActions';
import { updateUser } from '../../redux/actions/updateUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';
import { getUserContent } from '../../redux/actions/getUserContentActions';

@connect((store) => {
  return {
    syncUserDataState: store.syncUserData.userList,
    getUserState: store.getUser.user,
    updateUserState: store.updateUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
    getUserContentState: store.getUserContent.articleList,
  };
})

export default class MyProfile extends Component {

  componentDidMount() {
    const syncUserUuid = cookie.load('ck_uuid');

    superagent
    .post('/syncUserData')
    .send({ userUuid: syncUserUuid })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.props.dispatch(syncUserData(res.body.userDataSync));
      }
    });

    superagent
    .post('/getUserContent')
    .send({ userUuid: syncUserUuid })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.props.dispatch(getUserContent(res.body.blogArticles));
      }
    });
  }

  state = {
    formStatus: 0,
    formMsg: '',
    showModalMale: false,
    showModalFemale: false,
    showModalFlags: false,
    show1a: true, show2a: true, show3a: true, show4a: true, show5a: true, show6a: true, show7a: true, show8a: true, show9a: true, show10a: true, show11a: true, show12a: true, show13a: true
  }

  modalOpen = (mode) => {
    if(mode === 1){
      this.setState({ showModalMale: true });
    }
    if(mode === 2){
      this.setState({ showModalFemale: true });
    }
    if(mode === 3){
      this.setState({ showModalFlags: true });
    }
  }
  modalClose = () => {
    this.setState({ showModalMale: false });
    this.setState({ showModalFemale: false });
    this.setState({ showModalFlags: false });
  }
  show1a = (status) => { this.setState({ show1a: status }); }
  show2a = (status) => { this.setState({ show2a: status }); }
  show3a = (status) => { this.setState({ show3a: status }); }
  show4a = (status) => { this.setState({ show4a: status }); }
  show5a = (status) => { this.setState({ show5a: status }); }
  show6a = (status) => { this.setState({ show6a: status }); }
  show7a = (status) => { this.setState({ show7a: status }); }
  show8a = (status) => { this.setState({ show8a: status }); }
  show9a = (status) => { this.setState({ show9a: status }); }
  show10a = (status) => { this.setState({ show10a: status }); }
  show11a = (status) => { this.setState({ show11a: status }); }
  show12a = (status) => { this.setState({ show12a: status }); }
  show13a = (status) => { this.setState({ show13a: status }); }

  updateUserProfile = (whichField, newValue) => {
    const updatersEmailDef = cookie.load('ck_email');
    const updatersUuidDef = cookie.load('ck_uuid');
    const whichFieldDef = whichField;
    const newValueDef = newValue;

    let checkLength = 0;
    if(whichFieldDef === 'description'){
      if(newValueDef.length < 10 || newValueDef.length > 500){
        checkLength = 1;
      }
    }else{
      if(whichFieldDef === 'avatar' || whichFieldDef === 'kanton'){
        checkLength = 0;
      } else{
        if(newValueDef.length < 2 || newValueDef.length > 40){
          checkLength = 2;
        }
      }
    }

    if(checkLength === 0){
      this.setState({formStatus: 0});
      this.setState({formMsg: ''});
      superagent
      .post('/updateUserProfile')
      .send({ field: whichFieldDef, email: updatersEmailDef, uuid: updatersUuidDef, newvalue: newValueDef })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if (res.body.status === 1) {
          cookie.save('ck_pw', res.body.userData.password, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_birthday', res.body.userData.birthday, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_avatar', res.body.userData.avatar, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_nickname', res.body.userData.nickname, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_job', res.body.userData.job, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_company', res.body.userData.company, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_description', res.body.userData.description, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_membersince', res.body.userData.membersince, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_kanton', res.body.userData.kanton, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });

          cookie.save('ck_social_fb', res.body.userData.socialFb, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_social_github', res.body.userData.socialGithub, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_social_twitter', res.body.userData.socialTwitter, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_social_linkedin', res.body.userData.socialLinkedin, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_social_xing', res.body.userData.socialXing, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_social_website', res.body.userData.socialWebsite, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });

          this.props.dispatch(updateUser(whichFieldDef, newValueDef, res.body.userData));
          this.modalClose();
          this.show1a(true); this.show2a(true); this.show3a(true); this.show4a(true);
        }
        if (res.body.status === 2) {
          this.modalClose();
          this.show1a(true); this.show2a(true); this.show3a(true); this.show4a(true);
        }
      });
    }
    if(checkLength === 1){ /* description length error */
      this.setState({formStatus: 1});
      this.setState({formMsg: 'Fehler: Mindestens 10 Zeichen und maximal 500 Zeichen erlaubt.'});
    }
    if(checkLength === 2){ /* other fields length error */
      this.setState({formStatus: 1});
      this.setState({formMsg: 'Fehler: Mindestens 2 Zeichen und maximal 40 Zeichen erlaubt.'});
    }
  }

  handleKeyPress = (event, whichField, newValue) => {
    if(event.key === 'Enter'){
        this.updateUserProfile(whichField, newValue);
    }
  }

  render() {
    const { syncUserDataState, getUserState, getUserContentState, activateNewUserState, updateUserState } = this.props;
    const { formStatus, formMsg, showModalMale, showModalFemale, showModalFlags } = this.state;
    const styles = require('./MyProfile.scss');

    console.log("mumumu: "+JSON.stringify(getUserContentState));

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

    /* Set avatar either from Cache or when ou change the avatar -> from State */
    let objectSelector = 'avatar'+syncAvatar;
    let avatarClass = styles[objectSelector];
    if(updateUserState.avatar){
      let objectSelector = 'avatar'+updateUserState.avatar;
      avatarClass = styles[objectSelector];
    }

    /* Set KANTON-flag either from Cache or when ou change the flag -> from State */
    let objectSelectorFlag = 'flag'+syncKanton;
    let flagClass = styles[objectSelectorFlag];
    if(updateUserState.kanton){
      let objectSelectorFlag = 'flag'+updateUserState.kanton;
      flagClass = styles[objectSelectorFlag];
    }

    /* Set nickname */
    let getNickname = syncNickname;
    if(updateUserState.nickname){
      getNickname = updateUserState.nickname;
    }
    if(getNickname === null){getNickname = 'noob';}

    /* Set job */
    let getJob = syncJob;
    if(updateUserState.job){
      getJob = updateUserState.job;
    }
    if(getJob === null){getJob = 'Keine Angabe';}

    /* Set company */
    let getCompany = syncCompany;
    if(updateUserState.company){
      getCompany = updateUserState.company;
    }
    if(getCompany === null){getCompany = 'Keine Angabe';}

    /* Set description */
    let getDescription = syncDescription;
    if(updateUserState.description){
      getDescription = updateUserState.description;
    }
    if(getDescription === null){getDescription = 'Keine Angabe';}

    return (
        <div className={styles.myprofilePage + ' container'}>
          <Helmet title="Mein Profil"/>
          {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && syncActivation === true) ?
            <div>
              <Row>
                <Col xs={12}>
                  {this.state.show1a === true ?
                    <h1>{getNickname} <Button bsSize="small" className={styles.btnEdit} onClick={() => this.show1a(false)}><i className="fa fa-pencil"/></Button></h1>
                  :
                    <div className={styles.mb10 + ' ' + styles.headline}>
                        <input className={styles.fixFormStyle} type="text" ref="nickname" name="nickname" id="nickname" defaultValue={getNickname} onKeyPress={(event) => this.handleKeyPress(event, 'nickname', this.refs.nickname.value)} />
                        <Button className={styles.btnSave} bsSize="small" onClick={() => this.updateUserProfile('nickname', this.refs.nickname.value)}><i className="fa fa-check"/></Button>
                    </div>
                  }
                  <hr />
                  {formStatus === 1 ?
                    <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
                    : null
                  }
                </Col>

                <Col className={styles.mb35} xs={12} sm={6}>
                    <Col xs={12}>
                      <Row>
                        <Col xs={4}>
                          <div className={avatarClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain}></div>
                        </Col>
                        <Col xs={8}>
                          <Button className={styles.btnAvatar} bsSize="small" onClick={() => this.modalOpen(1)}>
                            <i className="fa fa-male" />
                          </Button>
                          <Button className={styles.btnAvatar} bsSize="small" onClick={() => this.modalOpen(2)}>
                            <i className="fa fa-female" />
                          </Button>
                        </Col>
                      </Row>
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={4}>Mitglied seit</Col>
                    <Col className={styles.m15 + ' ' + styles.topLine} xs={8}>{syncMembersince}</Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={4}>Email</Col>
                    <Col className={styles.m15 + ' ' + styles.topLine} xs={8}>{syncEmail}</Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={4}>Job</Col>
                    <Col className={styles.m15 + ' ' + styles.topLine} xs={8}>
                      {this.state.show2a === true ?
                        <div>{getJob} <Button bsSize="small" className={styles.btnEdit} onClick={() => this.show2a(false)}><i className="fa fa-pencil"/></Button></div>
                      :
                        <div>
                          <div className={styles.m15 + ' ' + styles.m0p0}>
                            <div>
                              <input type="text" ref="job" name="job" id="job" className={styles.fixFormStyle + ' ' + styles.pro70} defaultValue={getJob} onKeyPress={(event) => this.handleKeyPress(event, 'job', this.refs.job.value)} />
                              <Button bsSize="small" className={styles.btnSave} onClick={() => this.updateUserProfile('job', this.refs.job.value)}><i className="fa fa-check"/></Button>
                            </div>
                          </div>
                        </div>
                      }
                    </Col>

                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={4}>Firma</Col>
                    <Col className={styles.m15 + ' ' + styles.topLine} xs={8}>
                      {this.state.show3a === true ?
                        <div>{getCompany} <Button bsSize="small" className={styles.btnEdit} onClick={() => this.show3a(false)}><i className="fa fa-pencil"/></Button></div>
                      :
                        <div>
                          <div className={styles.m15 + ' ' + styles.m0p0}>
                            <div>
                              <input type="text" ref="company" name="company" id="company" className={styles.fixFormStyle + ' ' + styles.pro70} defaultValue={getCompany} onKeyPress={(event) => this.handleKeyPress(event, 'company', this.refs.company.value)} />
                              <Button bsSize="small" className={styles.btnSave} onClick={() => this.updateUserProfile('company', this.refs.company.value)}><i className="fa fa-check"/></Button>
                            </div>
                          </div>
                        </div>
                      }
                    </Col>



                    <Col className={styles.m15 + ' ' + styles.topLine + ' ' + styles.font999} xs={12}>Über dich <Button bsSize="small" className={styles.btnEdit} onClick={() => this.show4a(false)}><i className="fa fa-pencil"/></Button></Col>
                    <Col className={styles.m15} xs={12}>
                      {this.state.show4a === true ?
                        <div className={styles.makeItalic + ' ' + styles.whiteSpacePreWrap}>{getDescription}</div>
                      :
                        <div>
                          <div className={styles.m15 + ' ' + styles.m0p0}>
                            <div>
                              <textarea name="description" ref="description" className={'form-control ' + styles.fixTextarea}>{getDescription}</textarea>
                              <Button bsSize="small" className={styles.btnSave + ' ' + styles.btnSaveTextarea} onClick={() => this.updateUserProfile('description', this.refs.description.value)}><i className="fa fa-check"/></Button>
                            </div>
                          </div>
                        </div>
                      }
                    </Col>
              </Col>

              <Col className={styles.mb35} xs={12} sm={6}>
                <Col xs={12}>
                  <Row>
                    <Col xs={4}>
                      <div className={flagClass + ' ' + styles.avatarRound + ' ' + styles.avatarMain}></div>
                    </Col>
                    <Col xs={8}>
                      <Button className={styles.btnAvatar} bsSize="small" onClick={() => this.modalOpen(3)}>
                        <i className="fa fa-globe" />
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.m15 + ' ' + styles.topLine} xs={12}>
                  <h4>Projekte</h4>
                  <p>Llorem ipsum, llorem ipsum ... </p>
                </Col>
                <Col className={styles.m15 + ' ' + styles.topLine} xs={12}>
                  <h4>Beiträge</h4>
                  <p>Llorem ipsum, llorem ipsum ... </p>
                </Col>
                <Col className={styles.m15 + ' ' + styles.topLine} xs={12}>
                  <h4>Kommentare</h4>
                  <p>Llorem ipsum, llorem ipsum ... </p>
                </Col>
              </Col>
            </Row>

            <Modal show={this.state.showModalMale} onHide={this.modalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Avatar auswählen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row className="show-grid">
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '1')} className={styles.avatar1 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '2')} className={styles.avatar2 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '3')} className={styles.avatar3 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '4')} className={styles.avatar4 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '5')} className={styles.avatar5 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '6')} className={styles.avatar6 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '7')} className={styles.avatar7 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '8')} className={styles.avatar8 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '9')} className={styles.avatar9 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '10')} className={styles.avatar10 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '11')} className={styles.avatar11 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '12')} className={styles.avatar12 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '13')} className={styles.avatar13 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '14')} className={styles.avatar14 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '15')} className={styles.avatar15 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '16')} className={styles.avatar16 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '17')} className={styles.avatar17 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '18')} className={styles.avatar18 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '19')} className={styles.avatar19 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '20')} className={styles.avatar20 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '21')} className={styles.avatar21 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '22')} className={styles.avatar22 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '23')} className={styles.avatar23 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '24')} className={styles.avatar24 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '25')} className={styles.avatar25 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                  </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.modalClose}>Schliessen</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showModalFemale} onHide={this.modalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Avatar auswählen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row className="show-grid">
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '26')} className={styles.avatar26 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '27')} className={styles.avatar27 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '28')} className={styles.avatar28 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '29')} className={styles.avatar29 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '30')} className={styles.avatar30 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '31')} className={styles.avatar31 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '32')} className={styles.avatar32 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '33')} className={styles.avatar33 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '34')} className={styles.avatar34 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '35')} className={styles.avatar35 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '36')} className={styles.avatar36 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '37')} className={styles.avatar37 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '38')} className={styles.avatar38 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '39')} className={styles.avatar39 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '40')} className={styles.avatar40 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '41')} className={styles.avatar41 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '42')} className={styles.avatar42 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '43')} className={styles.avatar43 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '44')} className={styles.avatar44 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '45')} className={styles.avatar45 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '46')} className={styles.avatar46 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '47')} className={styles.avatar47 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '48')} className={styles.avatar48 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '49')} className={styles.avatar49 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('avatar', '50')} className={styles.avatar50 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                  </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.modalClose}>Schliessen</Button>
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.showModalFlags} onHide={this.modalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Kanton auswählen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row className="show-grid">
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '1')} className={styles.flag1 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '2')} className={styles.flag2 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '3')} className={styles.flag3 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '4')} className={styles.flag4 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '5')} className={styles.flag5 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '6')} className={styles.flag6 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '7')} className={styles.flag7 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '8')} className={styles.flag8 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '9')} className={styles.flag9 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '10')} className={styles.flag10 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '11')} className={styles.flag11 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '12')} className={styles.flag12 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '13')} className={styles.flag13 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '14')} className={styles.flag14 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '15')} className={styles.flag15 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '16')} className={styles.flag16 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '17')} className={styles.flag17 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '18')} className={styles.flag18 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '19')} className={styles.flag19 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '20')} className={styles.flag20 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '21')} className={styles.flag21 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '22')} className={styles.flag22 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '23')} className={styles.flag23 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '24')} className={styles.flag24 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '25')} className={styles.flag25 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '26')} className={styles.flag26 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                    <Col xs={4} sm={2}><div onClick={() => this.updateUserProfile('kanton', '27')} className={styles.flag27 + ' ' + styles.avatarRound + ' ' + styles.clickElement}></div></Col>
                  </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.modalClose}>Schliessen</Button>
              </Modal.Footer>
            </Modal>

            </div>
          :
            <Loader show={!getUserState.loading} message={''} hideContentOnLoad={true}>
                <Alert bsStyle="warning">Fehler: Bitte erstelle einen Account oder logge dich mit deinem bestehenden Usernamen und Passwort ein.</Alert>
            </Loader>
          }
        </div>
    );
  }

}
