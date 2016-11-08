import React, {Component} from 'react';
import Well from 'react-bootstrap/lib/Well';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import superagent from 'superagent';
import cookie from 'react-cookie';
import { connect } from 'react-redux';

import { registerNewUser } from '../../redux/actions/registerNewUserActions';

@connect((store) => {
  return {
    registerNewUserState: store.registerNewUser.user,
  };
})

export default class Register extends Component {
  state = {
    formStatus: 0,
    formMsg: ''
  }

  validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const inputEmail = this.refs.email.value;
    const inputPassword = this.refs.password.value;

    if (this.validateEmail(inputEmail)) {
      if (inputPassword.length > 2 && inputPassword.length < 40) {
        superagent
        .post('/registrieren')
        .type('form')
        .send({ email: inputEmail, password: inputPassword })
        .set('Accept', 'application/json')
        .end((error, res) => {
          if (res.body.status === 1) {
            this.setState({formStatus: 2});
            this.setState({formMsg: 'Herzlich willkommen bei der Swiss React Community! Um deinen Account zu aktivieren, klicke bitte auf den Aktivierungslink in dem Bestätigungsmail welches dir automatisch an <strong>' + inputEmail + '</strong> gesendet wurde!'});
            console.log("res.body.uuid: " + res.body.uuid + ' ZZZ ' + String(res.body.uuid));
            this.props.dispatch(registerNewUser(true, inputEmail, inputPassword, res.body.uuid));

            cookie.save('ck_email', inputEmail, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
            cookie.save('ck_pw', inputPassword, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
            cookie.save('ck_uuid', res.body.uuid, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
            cookie.save('ck_activation', false, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });

            let uuuid = cookie.load('ck_uuid');
            console.log(cookie.load('ck_uuid') + " TTT " + uuuid);

          } else {
            this.setState({formStatus: 1});
            this.setState({formMsg: 'Diese Email-Adresse wurde bereits registriert, wählen Sie bitte eine andere.'});
          }
        });
      } else {
        this.setState({formStatus: 1});
        this.setState({formMsg: 'Das Passwort muss min. 3 und max. 40 Zeichen enthalten.'});
      }
    } else {
      this.setState({formStatus: 1});
      this.setState({formMsg: 'Das ist keine gültige Email-Adresse.'});
    }
  }

  render() {
    const { registerNewUserState } = this.props;

    const {formStatus, formMsg} = this.state;
    const styles = require('./Register.scss');
    return (
      <div className={styles.registerPage + ' container'}>
        <Helmet title="Registrieren"/>
        <h1>Registrieren</h1>
        {formStatus === 2 ?
          <Well>
            <h3>Erfolgreich registriert</h3>
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
          <div id="register-form">
            <form className="login-form form-inline" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                <input type="text" ref="email" name="email" id="email" placeholder="Email" className="form-control"/>
              </div>
              <div className="form-group">
                <input type="password" ref="password" name="password" id="password" placeholder="Passwort" className="form-control"/>
              </div>
              <button type="submit" className="btn btn-success"><i className="fa fa-sign-in"/> Registrieren</button>
            </form>
          </div>
          : null
        }
      </div>
    );
  }


}
