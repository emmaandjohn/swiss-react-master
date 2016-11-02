import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
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
        this.props.pushState('/');
      }
    }

    onNavItemClick = () => {
      this.setState({ navExpanded: false });
    }

    onLogout = () => {
      this.onNavItemClick();
      cookie.save('ck_userLoggedIn', false, { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
      this.setState({ navExpanded: false });
      /* Update UserState */
      const ck_activation2 = cookie.load('ck_activation');
      const ck_email2 = cookie.load('ck_email');
      const ck_pw2 = cookie.load('ck_pw');
      const ck_uuid2 = cookie.load('ck_uuid');

      /* Reload State with LoggedOut User-State */
      this.props.dispatch(activateNewUser(true, false));
      alert("Erfolgreich ausgeloggt!");
    }

    onNavbarToggle = () => {
      this.setState({ navExpanded: ! this.state.navExpanded });
    }
    handleLogout = (event) => {
      event.preventDefault();
      this.props.logout();
    }

    render() {
      const styles = require('./App.scss');
      const { getUserState, activateNewUserState } = this.props;

      return (
        <div className={styles.app}>
          <Helmet {...config.app.head}/>
          <div className="preload-images"></div>
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
                      <NavItem eventKey={1} onClick={ this.onNavItemClick }>Community</NavItem>
                    </LinkContainer>
                    {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
                    <LinkContainer to="/meinprofil">
                      <NavItem eventKey={2} onClick={ this.onNavItemClick }>Mein Profil</NavItem>
                    </LinkContainer>
                    :
                    <LinkContainer to="/registrieren">
                      <NavItem eventKey={2} onClick={ this.onNavItemClick }>Mitmachen</NavItem>
                    </LinkContainer>
                    }
                    <LinkContainer to="/kontakt">
                      <NavItem eventKey={3} onClick={ this.onNavItemClick }>Kontakt</NavItem>
                    </LinkContainer>
                    {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
                      <NavItem eventKey={4} onClick={ this.onLogout }>Logout</NavItem>
                    :
                    <LinkContainer to="/login">
                      <NavItem eventKey={5} onClick={ this.onNavItemClick }>Login</NavItem>
                    </LinkContainer>
                    }
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Loader>
          <div className={styles.appContent}>
            {this.props.children}
          </div>
          <Loader show={!getUserState.loading} message={''} hideContentOnLoad={true}>
            <InfoBar/>
          </Loader>
          <div className="well text-center">
            Copyright { new Date().getFullYear() } | Swiss React Community | React, Redux, Flux, React Native | Swiss-react.ch
          </div>
        </div>
      );
    }
  }
