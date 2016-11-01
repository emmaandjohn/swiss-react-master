import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import superagent from 'superagent';
import Well from 'react-bootstrap/lib/Well';
import cookie from 'react-cookie';

/* Import here only for Dispatchers */
import { getUser } from '../../redux/actions/getUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';

@connect((store) => {
  return {
    getUserState: store.getUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
  };
})

export default class Forgot extends Component {
  state = {
    formStatus: 0,
    formMsg: ''
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const inputEmail = this.refs.email.value;

      superagent
      .post('/forgot')
      .type('form')
      .send({ email: inputEmail })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if (res.body.status === 1) {
          this.setState({formStatus: 2});
          this.setState({formMsg: 'Das Passwort wurde erfolgreich an <strong>'+inputEmail+'</strong> zugeschickt!'});
        } else {
          this.setState({formStatus: 1});
          this.setState({formMsg: 'Fehler: Diese Email-Adresse existiert nicht!'});
        }
      });
  }

  render() {
    const { getUserState } = this.props;
    const { formStatus, formMsg } = this.state;
    const styles = require('./Forgot.scss');

    return (
        <div className={styles.forgotPage + ' container'}>
          <h1>Passwort vergessen</h1>
          <Helmet title="Passwort vergessen"/>
          {formStatus === 2 ?
            <Well>
              <h3>Passwort erfolgreich verschickt</h3>
              <div dangerouslySetInnerHTML={{__html: formMsg}}></div>
            </Well>
            : null
          }
          {formStatus === 1 ?
              <Well>
                <h3>Fehler</h3>
                <div dangerouslySetInnerHTML={{__html: formMsg}}></div>
              </Well>
              : null
          }
          {formStatus < 2 ?
          <div id="login-form">
            <form className="login-form form-inline" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <input type="text" ref="email" name="email" id="email" placeholder="Email" className="form-control"/>
              </div>
              <button type="submit" className="btn btn-success"><i className="fa fa-sign-in"/> Passwort zustellen</button>
            </form>
          </div>
          : null
        }
        </div>
    );
  }

}
