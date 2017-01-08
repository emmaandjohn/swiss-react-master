import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

@connect((store) => {
  return {
    registerNewUserState: store.registerNewUser.user,
  };
})

export default class Suche extends Component {

  render() {
    const { registerNewUserState } = this.props;
    return (
        <div className="container">
          <h1>Suche</h1>
          <Helmet title="Suche"/>
          <p>Suche... {registerNewUserState.email}</p>
        </div>
    );
  }

}
