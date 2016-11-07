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

  chooseAvatar = (n) => {
    console.log("Edit dude!" + n);
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
                      <div onClick={this.modalOpen} className={styles.avatarM01 + ' ' + styles.avatarRound}></div>
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
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(1)} className={styles.avatarM01 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(2)} className={styles.avatarM02 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(3)} className={styles.avatarM03 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(4)} className={styles.avatarM04 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(5)} className={styles.avatarM05 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(6)} className={styles.avatarM06 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(7)} className={styles.avatarM07 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(8)} className={styles.avatarM08 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(9)} className={styles.avatarM09 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(10)} className={styles.avatarM10 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(11)} className={styles.avatarM11 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(12)} className={styles.avatarM12 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(13)} className={styles.avatarM13 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(14)} className={styles.avatarM14 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(15)} className={styles.avatarM15 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(16)} className={styles.avatarM16 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(17)} className={styles.avatarM17 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(18)} className={styles.avatarM18 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(19)} className={styles.avatarM19 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(20)} className={styles.avatarM20 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(21)} className={styles.avatarM21 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(22)} className={styles.avatarM22 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(23)} className={styles.avatarM23 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(24)} className={styles.avatarM24 + ' ' + styles.avatarRound}></div></Col>
                    <Col xs={3} sm={2}><div onClick={() => this.chooseAvatar(25)} className={styles.avatarM25 + ' ' + styles.avatarRound}></div></Col>
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
