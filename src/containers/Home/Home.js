import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col, Well, Label } from 'react-bootstrap/lib';
import {connect} from 'react-redux';
import config from '../../config';
import Helmet from 'react-helmet';
import superagent from 'superagent';

import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';

@connect((store) => {
  return {
    getBlogEntriesState: store.getBlogEntries.articleList,
  };
})

export default class Home extends Component {

  componentDidMount() {
    superagent
    .post('/community')
    .send({ loadStatus: 2 })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.props.dispatch(getBlogEntries(res.body.blogArticles));
      }
    });
  }

  static propTypes = {
    userLoggedIn: PropTypes.string
  }

  render() {
    const styles = require('./Home.scss');
    const { getBlogEntriesState } = this.props;
    // require the logo image both from client and server
    const logoImage = require('./logo.png');

    let blogContentDef = '';
    /*getBlogEntriesState.articles.sort(function(a, b){
        return b.unixtime-a.unixtime
    });*/
    getBlogEntriesState.articles.forEach(function(entry){
      /*blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;"><h2 style="color: #d52b1e;">' +
                        entry.titel + '</h2><hr />' +
                        entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' +
                        entry.userEmail + ' | ' +
                        entry.timeFormatted + '</span></div>';
                        */
      blogContentDef += '<Row><Col xs={6}>Test</Col><Col xs={6}>Test</Col></Row>';
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

        <div className='container'>
          <h3>Neuste Blogeinträge</h3>
            <div dangerouslySetInnerHTML={{__html: blogContentDef}}></div>
        </div>
      </div>
    );
  }
}
