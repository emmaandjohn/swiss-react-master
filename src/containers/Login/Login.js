import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import superagent from 'superagent';
import { Well, Alert, Button } from 'react-bootstrap/lib';
import cookie from 'react-cookie';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

/* Import here only for Dispatchers */
import { activateNewUser } from '../../redux/actions/activateNewUserActions';
import { msgBox } from '../../redux/actions/msgBoxActions';

@connect((store) => {
  return {
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
          if(res.body.userData.nickname === null){res.body.userData.nickname = 'noob';}
          //this.setState({formStatus: 2});
          //this.setState({formMsg: 'Login erfolgreich! Willkommen zurück <strong>' + res.body.userData.nickname + '</strong>!'});

          this.props.dispatch(activateNewUser(true, true));

          cookie.save('ck_userLoggedIn', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_email', inputEmail, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_pw', inputPassword, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_uuid', res.body.userData.uuid, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
          cookie.save('ck_activation', true, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });

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

          cookie.save('ck_tempEditArt', 'false', { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });

          this.props.dispatch(push('/meinprofil'));
          scroll(0,0);
          this.props.dispatch(msgBox(true, 'Login erfolgreich! Willkommen zurück <strong>' + res.body.userData.nickname + '</strong>!'));

        } else {
          this.setState({formStatus: 1});
          this.setState({formMsg: 'Fehler: Der Username oder das Passwort stimmen nicht überein (oder du hast dein Account noch nicht aktiviert)!'});
        }
      });
  }

  render() {
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
                <input type="email" ref="email" name="email" id="email" placeholder="Email" autocorrect="off" autocapitalize="none" className="form-control"/>
              </div>
              <div className="form-group">
                <input type="password" ref="password" name="password" id="password" placeholder="Passwort" autocorrect="off" autocapitalize="none" className="form-control"/>
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
