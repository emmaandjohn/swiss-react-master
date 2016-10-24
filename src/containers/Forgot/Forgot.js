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
          this.setState({formMsg: 'Das Passwort wurde an '+inputEmail+' / '+res.body.pw.password+' zugeschickt!'});

          /*this.props.dispatch(activateNewUser(true, true));

          cookie.save('ck_userLoggedIn', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_email', inputEmail, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_pw', inputPassword, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_uuid', res.body.uuid.uuid, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_activation', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });*/
        } else {
          this.setState({formStatus: 1});
          this.setState({formMsg: 'Fehler: Diese Email-Adresse existiert nicht!'});
        }
      });
  }

  forgotPassword = (event) => {
    event.preventDefault();
    console.log("password vergessen");
  }

  render() {
    const { getUserState } = this.props;
    const { formStatus, formMsg } = this.state;

    return (
        <div className="container">
          <h1>Login</h1>
          <Helmet title="Login"/>
          {formStatus === 2 ?
            <Well>
              <h3>Passwort verschickt</h3>
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
              <button type="submit" className="btn btn-success"><i className="fa fa-sign-in"/> Login</button>
              <button onClick={this.forgotPassword.bind(this)} className="btn btn-link">Passwort vergessen</button>
            </form>
          </div>
          : null
        }
        </div>

    );
  }

}
