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
    const { registerNewUserState } = this.props;
    return (
        <div className="container">
          <h1>Videos</h1>
          <Helmet title="Videos"/>

            <div className={'row'}>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/6I5SKBVIX9Q" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MhkGQAoc7bc" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/fd2Cayhez58" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=vu_rIMPROoQ" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=qh3dYM6Keuw" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=_D1JGNidMr4" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=1iAG6h9ff5s" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=ZBxMljq9GSE" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=XVdwq8W2ZsM" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=PvjNglsyOHs" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe width="560" height="315" src="https://www.youtube.com/watch?v=bvEC6i7CUyE" frameborder="0" allowfullscreen></iframe>
              </div>
              <div className={'col-xs-12'}>
                <iframe src="https://www.youtube.com/watch?v=MZfCVq5iCBw" frameborder="0" allowfullscreen></iframe>
              </div>
            </div>

        </div>
    );
  }

}
