import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { Grid, Row, Col, Well, Label, Button } from 'react-bootstrap/lib';
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
    formMsg: ''
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
                  <Col md={6}>{'Avatar1'}</Col>
                  <Col md={6}>{'Avatar2'}</Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>{'Avatar3'}</Col>
            </Row>
          </Grid>
          <div className={styles.avatarRound + ' ' + styles.avatarM01}></div>
        </div>
    );
  }

}
