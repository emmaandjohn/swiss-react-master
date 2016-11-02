import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import superagent from 'superagent';
import Well from 'react-bootstrap/lib/Well';
import Alert from 'react-bootstrap/lib/Alert';
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

export default class Login extends Component {
  state = {
    formStatus: 0,
    formMsg: ''
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const inputEmail = this.refs.email.value;
    const inputPassword = this.refs.password.value;

      superagent
      .post('/login')
      .type('form')
      .send({ email: inputEmail, password: inputPassword })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if (res.body.status === 1) {
          this.setState({formStatus: 2});
          this.setState({formMsg: 'Login erfolgreich! Willkommen zurück <strong>' + inputEmail + '</strong>!'});

          this.props.dispatch(activateNewUser(true, true));

          cookie.save('ck_userLoggedIn', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_email', inputEmail, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_pw', inputPassword, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_uuid', res.body.uuid.uuid, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_activation', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
        } else {
          this.setState({formStatus: 1});
          this.setState({formMsg: 'Fehler: Der Username oder das Passwort stimmen nicht überein (oder du hast dein Account noch nicht aktiviert)!'});
        }
      });
  }

  render() {
    const { getUserState } = this.props;
    const { formStatus, formMsg } = this.state;
    const styles = require('./Login.scss');

    return (
        <div className={styles.loginPage + ' container'}>
          <h1>Login</h1>
          <Helmet title="Login"/>
          {formStatus === 2 ?
            <Alert bsStyle="success"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
            : null
          }
          {formStatus === 1 ?
            <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
            : null
          }
          {formStatus < 2 ?
          <div id="login-form">
            <form className="login-form form-inline" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <input type="text" ref="email" name="email" id="email" placeholder="Email" className="form-control"/>
              </div>
              <div className="form-group">
                <input type="password" ref="password" name="password" id="password" placeholder="Passwort" className="form-control"/>
              </div>
              <button type="submit" className={styles.btnSpacer + ' btn btn-success'}><i className="fa fa-sign-in"/> Login</button>
              <Link to="/forgot"><Button>Passwort vergessen</Button></Link>
            </form>
          </div>
          : null
        }
        </div>

    );
  }

}
