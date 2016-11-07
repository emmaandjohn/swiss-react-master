import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button, Modal, Alert } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { Link } from 'react-router';

/* Import here only for Dispatchers */
import { activateNewUser } from '../../redux/actions/activateNewUserActions';

@connect((store) => {
  return {
    activateNewUserState: store.activateNewUser.userStatus,
  };
})

export default class MyProfile extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    showModal: false
  }

  editProfile = () => {
    console.log("Edit dude!");
  }

  modalOpen = () => {
    this.setState({ showModal: true });
  }
  modalClose = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { activateNewUserState } = this.props;
    const { formStatus, formMsg, showModal } = this.state;
    const styles = require('./MyProfile.scss');

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
                      <div className={styles.avatarM01 + ' ' + styles.avatarRound}></div>
                    </Col>
                    <Col xs={10}>{'Nichname XY'} <Button onClick={this.modalOpen}><i className="fa fa-pencil"/></Button></Col>
                  </Row>
                </Col>
                <Col xs={12} md={6}>{'Avatar3'}</Col>
              </Row>
            <Modal show={this.state.showModal} onHide={this.modalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Avatar auswählen</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="show-grid">
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                  <Col xs={1}><div className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
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
