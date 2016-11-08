import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button, Modal, Alert } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { Link } from 'react-router';

/* Import here only for Dispatchers */
import { updateUser } from '../../redux/actions/updateUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';

@connect((store) => {
  return {
    updateUserState: store.updateUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
  };
})

export default class MyProfile extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    showModalMale: false,
    showModalFemale: false
  }

  updateUserProfile = (whichField, newValue) => {
    const updatersEmailDef = cookie.load('ck_email');
    const updatersUuidDef = cookie.load('ck_uuid');
    const whichFieldDef = whichField;
    const newValueDef = newValue;
    console.log(cookie.load('ck_uuid') + ' GGG ' + updatersUuidDef);
    console.log("updateUserProfile: "+ updatersEmailDef+updatersUuidDef+whichFieldDef+newValueDef)

    superagent
    .post('/updateUserProfile')
    .send({ field: whichFieldDef, email: updatersEmailDef, uuid: updatersUuidDef, newvalue: newValueDef })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        console.log("db success: "+ res + JSON.stringify(res));

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

      } else {

      }
    });
  }

  modalOpen = (gender) => {
    if(gender === 1){
      this.setState({ showModalMale: true });
    }else{
      this.setState({ showModalFemale: true });
    }
  }
  modalClose = () => {
    this.setState({ showModalMale: false });
    this.setState({ showModalFemale: false });
  }

  render() {
    const { activateNewUserState, updateUserState } = this.props;
    const { formStatus, formMsg, showModalMale, showModalFemale } = this.state;
    const styles = require('./MyProfile.scss');

    console.log("state.avatar: "+updateUserState.avatar+", ck.load.avatar: "+cookie.load('ck_avatar'));

    let objectSelector = 'avatar'+cookie.load('ck_avatar');
    let avatarClass = styles[objectSelector];
    if(updateUserState.avatar){
      console.log("yep change: "+updateUserState.avatar);
      let objectSelector = updateUserState.avatar;
      avatarClass = styles[objectSelector];
    }

    return (
        <div className={styles.myprofilePage + ' container'}>
          <h1>Mein Profil</h1>
          <Helmet title="Mein Profil"/>
          {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
          <div>
              <Row className="show-grid">
                <Col xs={12} md={6}>
                  <Row className="show-grid">
                    <Col xs={2}>
                      <div className={avatarClass + ' ' + styles.avatarRound}></div>
                      <i onClick={() => this.modalOpen(1)} className="fa fa-male" /> <i onClick={() => this.modalOpen(2)} className="fa fa-female" />
                    </Col>
                    <Col xs={10}><h4>Nickname XY</h4> <Button onClick={this.modalOpen}><i className="fa fa-pencil"/></Button></Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>{'Avatar3'}</Col>
              </Row>
            <Modal show={this.state.showModalMale} onHide={this.modalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Avatar auswählen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Row className="show-grid">
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '1')} className={styles.avatar1 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '2')} className={styles.avatar2 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '3')} className={styles.avatar3 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '4')} className={styles.avatar4 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '5')} className={styles.avatar5 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '6')} className={styles.avatar6 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '7')} className={styles.avatar7 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '8')} className={styles.avatar8 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '9')} className={styles.avatar9 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '10')} className={styles.avatar10 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '11')} className={styles.avatar11 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '12')} className={styles.avatar12 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '13')} className={styles.avatar13 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '14')} className={styles.avatar14 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '15')} className={styles.avatar15 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '16')} className={styles.avatar16 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '17')} className={styles.avatar17 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '18')} className={styles.avatar18 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '19')} className={styles.avatar19 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '20')} className={styles.avatar20 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '21')} className={styles.avatar21 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '22')} className={styles.avatar22 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '23')} className={styles.avatar23 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '24')} className={styles.avatar24 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '25')} className={styles.avatar25 + ' ' + styles.avatarRound}></div></Col>
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
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '26')} className={styles.avatar26 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '27')} className={styles.avatar27 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '28')} className={styles.avatar28 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '29')} className={styles.avatar29 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '30')} className={styles.avatar30 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '31')} className={styles.avatar31 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '32')} className={styles.avatar32 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '33')} className={styles.avatar33 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '34')} className={styles.avatar34 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '35')} className={styles.avatar35 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '36')} className={styles.avatar36 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '37')} className={styles.avatar37 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '38')} className={styles.avatar38 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '39')} className={styles.avatar39 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '40')} className={styles.avatar40 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '41')} className={styles.avatar41 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '42')} className={styles.avatar42 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '43')} className={styles.avatar43 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '44')} className={styles.avatar44 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '45')} className={styles.avatar45 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '46')} className={styles.avatar46 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '47')} className={styles.avatar47 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '48')} className={styles.avatar48 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '49')} className={styles.avatar49 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.updateUserProfile('avatar', '50')} className={styles.avatar50 + ' ' + styles.avatarRound}></div></Col>
                  </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.modalClose}>Schliessen</Button>
              </Modal.Footer>
            </Modal>
          </div>
          :
          <Alert bsStyle="warning">Fehler: Bitte erstelle einen Account oder logge dich mit deinem bestehenden Usernamen und Passwort ein.</Alert>
          }
        </div>
    );
  }

}
