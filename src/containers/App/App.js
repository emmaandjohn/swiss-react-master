import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, Alert } from 'react-bootstrap/lib';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { InfoBar } from 'components';
import { push } from 'react-router-redux';
import config from '../../config';
import { asyncConnect } from 'redux-async-connect';
import cookie from 'react-cookie';
import Loader from 'react-loader-advanced';

/* Import here only for Dispatchers */
import { getUser } from '../../redux/actions/getUserActions';
import { activateNewUser } from '../../redux/actions/activateNewUserActions';
import { msgBox } from '../../redux/actions/msgBoxActions';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isInfoLoaded(getState())) {
      promises.push(dispatch(loadInfo()));
    }
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])

@connect((store) => {
  return {
    getUserState: store.getUser.user,
    activateNewUserState: store.activateNewUser.userStatus,
    msgBoxState: store.msgBox.msgcontent,
  };
})

export default class App extends Component {
    state = {
      navExpanded: false
    }

    static propTypes = {
      children: PropTypes.object.isRequired,
      user: PropTypes.object,
      logout: PropTypes.func.isRequired,
      pushState: PropTypes.func.isRequired
    };

    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    componentWillMount() {
      const ck_activation = cookie.load('ck_activation');
      const ck_email = cookie.load('ck_email');
      const ck_pw = cookie.load('ck_pw');
      const ck_uuid = cookie.load('ck_uuid');

      this.props.dispatch(getUser(ck_activation, ck_email, ck_pw, ck_uuid));
    }

    componentWillReceiveProps(nextProps) {
      if (!this.props.user && nextProps.user) {
        // login
        this.props.pushState('/loginSuccess');
      } else if (this.props.user && !nextProps.user) {
        // logout
        this.props.dispatch(push('/'));
      }
    }

    onNavItemClick = () => {
      this.setState({ navExpanded: false });
    }
    closeThat = () => {
      this.props.dispatch(msgBox(false, ''));
    }

    onLogout = () => {
      this.onNavItemClick();
      cookie.save('ck_userLoggedIn', false, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
      this.setState({ navExpanded: false });

      /* Reload State with LoggedOut User-State */
      this.props.dispatch(activateNewUser(true, false));
      this.props.dispatch(push('/'));
      this.props.dispatch(msgBox(true, 'Du hast dich erfolgreich ausgeloggt! <i onClick={() => this.closeThat()} className="closing fa fa-remove" aria-hidden="true"></i>'));
    }

    onNavbarToggle = () => {
      this.setState({ navExpanded: ! this.state.navExpanded });
    }

    render() {
      const styles = require('./App.scss');
      const { getUserState, activateNewUserState, msgBoxState } = this.props;

      return (
        <div className={styles.app}>
          <Helmet {...config.app.head}/>
          <div className={styles.preloadimages}></div>
          <Loader show={!getUserState.loading} message={''} hideContentOnLoad={true}>
            <Navbar fixedTop expanded={ this.state.navExpanded } onToggle={ this.onNavbarToggle }>
              <Navbar.Header>
                <Navbar.Brand>
                  <IndexLink to="/" onClick={ this.onNavItemClick } activeStyle={{color: '#d52b1e'}}>
                    <div className={styles.brand}/>
                    <span>
                      {config.app.title}
                    </span>
                  </IndexLink>
                </Navbar.Brand>
                <Navbar.Toggle/>
              </Navbar.Header>
              <Navbar.Collapse>
                <Nav navbar>
                    <LinkContainer to="/community">
                      <NavItem eventKey={1} onClick={ this.onNavItemClick }><i className={"fa fa-comments " + styles.faNav} aria-hidden="true"></i> Community</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/suche">
                      <NavItem eventKey={2} onClick={ this.onNavItemClick }><i className={"fa fa-search " + styles.faNav} aria-hidden="true"></i> Suche</NavItem>
                    </LinkContainer>
                    {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
                    <LinkContainer to="/meinprofil">
                      <NavItem eventKey={3} onClick={ this.onNavItemClick }><i className={"fa fa-user " + styles.faNav} aria-hidden="true"></i> Mein Profil</NavItem>
                    </LinkContainer>
                    :
                    <LinkContainer to="/registrieren">
                      <NavItem eventKey={3} onClick={ this.onNavItemClick }><i className={"fa fa-sign-in " + styles.faNav} aria-hidden="true"></i> Mitmachen</NavItem>
                    </LinkContainer>
                    }
                    {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
                      <NavItem eventKey={4} onClick={ this.onLogout }><i className={"fa fa-sign-out " + styles.faNav} aria-hidden="true"></i> Logout</NavItem>
                    :
                    <LinkContainer to="/login">
                      <NavItem eventKey={5} onClick={ this.onNavItemClick }><i className={"fa fa-sign-in " + styles.faNav} aria-hidden="true"></i> Login</NavItem>
                    </LinkContainer>
                    }
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Loader>
          { msgBoxState.status === true ?
          <div className={styles.msgBox}>
            <Alert bsStyle="success"><div dangerouslySetInnerHTML={{__html: msgBoxState.msg}}></div></Alert>
          </div>
          : null
          }
          <div className={styles.appContent}>
            {this.props.children}
          </div>
          <div className="col-xs-12">
            <Loader show={!getUserState.loading} message={''} hideContentOnLoad={true}>
              <InfoBar/>
            </Loader>
            <div className="well text-center">
              Copyright { new Date().getFullYear() } | Swiss React Community | React, Redux, Flux, React Native | swiss-react.ch
            </div>
          </div>
        </div>
      );
    }
  }
