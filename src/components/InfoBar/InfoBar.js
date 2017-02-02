import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {load} from 'redux/modules/info';
import AdSense from 'react-adsense';

@connect(
    state => ({info: state.info.data}),
    dispatch => bindActionCreators({load}, dispatch))
export default class InfoBar extends Component {
  static propTypes = {
    info: PropTypes.object,
    load: PropTypes.func.isRequired
  }

  render() {
    const {info, load} = this.props; // eslint-disable-line no-shadow
    const styles = require('./InfoBar.scss');
    return (
      <div className={styles.infoBar + ' well'}>
        <div className="container">
          <div className={styles.cylon}></div>
          <div className={styles.mt5}>React.js, React Router, Redux / Redux Saga, React Router Redux, Flux, Relay, GraphQL, Node.js, MongoDB / Mongoose, MySQL, Firebase, Docker, AWS, Express / Koa / Hapi / Socket.io, JSX, Babel, Webpack, Browserify, Gulp, Grunt, ES6, ES7, ES8, React Native, Sass, Less, Bootstrap, Foundation, Universal / Isomorphic, Immutable.js, Omnicient / Om, Meteor, Vue.js, ESLint / JSLint / JSHint, Mocha / Enzyme, Selenium, Sonarqube, Cordova / Phonegap</div>
        </div>
        <div className={styles.adcontainerDesktop + ' container'}>
          <AdSense.Google client='ca-pub-4161847192982174'
                          slot='2930197099'
                          style={{width: 728, height: 90}}
                          format='' />
        </div>
        <div className={styles.adcontainerMobile + ' container'}>
          <AdSense.Google client='ca-pub-4161847192982174'
                          slot='1115386697'
                          style={{width: 320, height: 100}}
                          format='' />
        </div>
      </div>
    );
  }
}
