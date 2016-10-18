import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

@connect((store) => {
  return {
    registerNewUserState: store.registerNewUser.user,
  };
})

export default class Kontakt extends Component {

  render() {
    const { registerNewUserState } = this.props;
    return (
        <div className="container">
          <h1>Kontakt...</h1>
          <Helmet title="Kontakt"/>
          <p>Kontakt will open soon... {registerNewUserState.email}</p>
        </div>
    );
  }

}
