import React, { Component, PropTypes } from 'react';
import Well from 'react-bootstrap/lib/Well';
import {connect} from 'react-redux';
import config from '../../config';
import Helmet from 'react-helmet';

@connect((store) => {
  return {
    getBlogEntriesState: store.getBlogEntries.articleList,
  };
})

export default class Home extends Component {

  static propTypes = {
    userLoggedIn: PropTypes.string
  }

  render() {
    const styles = require('./Home.scss');
    const { getBlogEntriesState } = this.props;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = '';
    getBlogEntriesState.articles.sort(function(a, b){
        return b.unixtime-a.unixtime
    });
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;">' + entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' + entry.userEmail + ' | ' + entry.timeFormatted + '</span></div>';
    });

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <p>
                <img src={logoImage}/>
              </p>
            </div>
            <h1>{config.app.title}</h1>
            <h2>{config.app.description}</h2>
            <h2>{config.app.subdescription}</h2>
          </div>
        </div>

        <div className="container">
          <h3>Neuste Blogeinträge</h3>
          <div dangerouslySetInnerHTML={{__html: blogContentDef}}></div>
        </div>
      </div>
    );
  }
}
