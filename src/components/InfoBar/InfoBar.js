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
          Node.js Sternenzeit:
          {' '}
          <strong>{info ? info.message : 'no info!'}</strong>
          <span className={styles.time}>{info && new Date(info.time).toString()}</span>
          <button className="btn btn-primary" onClick={load}>Reload vom Server</button>
        </div>
        <div className="container">
          <AdSense.Google client='ca-pub-4161847192982174' slot='2930197099' />
        </div>
      </div>
    );
  }
}
