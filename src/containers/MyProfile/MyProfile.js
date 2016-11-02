import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import superagent from 'superagent';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
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
          {formStatus === 2 ?
            <Well>
              <h3>Erfolgreich eingeloggt</h3>
              <div dangerouslySetInnerHTML={{__html: formMsg}}></div>
            </Well>
            : null
          }
          {formStatus === 1 ?
              <Well>
                <h3>Fehler beim Login</h3>
                <div dangerouslySetInnerHTML={{__html: formMsg}}></div>
              </Well>
              : null
          }
          {formStatus < 2 ?
          <div id="myprofile-form">
            <p>adsasadsasd</p>
          </div>
          : null
        }
        </div>

    );
  }

}
