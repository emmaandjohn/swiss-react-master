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
          <div className={styles.cylon}></div> Node.js Sternenzeit:
          {' '}
          <strong>{info ? info.message : 'no info!'}</strong>
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
