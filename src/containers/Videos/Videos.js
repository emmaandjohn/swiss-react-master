import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

@connect((store) => {
  return {
    registerNewUserState: store.registerNewUser.user,
  };
})

export default class Videos extends Component {

  render() {
    const styles = require('./Videos.scss');
    const { registerNewUserState } = this.props;
    return (
        <div className="container">
          <h1>Videos</h1>
          <Helmet title="Videos"/>

            <div className={'row'}>
              <div className={'col-xs-8'}>
                <div className={styles.videoWrapper}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/6I5SKBVIX9Q" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
              <div className={'col-xs-8'}>
                <div className={styles.videoWrapper}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/MhkGQAoc7bc" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
              <div className={'col-xs-8'}>
                <div className={styles.videoWrapper}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/fd2Cayhez58" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            </div>

        </div>
    );
  }

}
