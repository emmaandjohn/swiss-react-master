import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button, Modal } from 'react-bootstrap/lib';
import { connect } from 'react-redux';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { Link } from 'react-router';

/* Import here only for Dispatchers */
import { getUser } from '../../redux/actions/getUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';

@connect((store) => {
  return {
    getUserState: store.getUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
  };
})

export default class MyProfile extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    showModal: false
  }

  modalOpen = () => {
    this.setState({ showModal: true });
  }
  modalClose = () => {
    this.setState({ showModal: false });
  }


  render() {
    const { getUserState } = this.props;
    const { formStatus, formMsg } = this.state;
    const styles = require('./MyProfile.scss');

    return (
        <div className={styles.myprofilePage + ' container'}>
          <h1>Mein Profil</h1>
          <Helmet title="Mein Profil"/>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={6}>
                <Row className="show-grid">
                  <Col md={6}><div className={styles.avatarRound + ' ' + styles.avatarM01}></div></Col>
                  <Col md={6}><Button bsStyle="link" onClick={this.modalOpen}>Avatar ändern</Button></Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>{'Avatar3'}</Col>
            </Row>
          </Grid>

          <Modal show={this.state.showModal} onHide={this.modalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Avatar auswählen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Text in a modal</h4>
              <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
              <h4>Popover in a modal</h4>
              <p>there is a here</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.modalClose}>Schliessen</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }

}
