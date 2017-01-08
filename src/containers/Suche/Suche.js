import React, {Component} from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import superagent from 'superagent';
import { push } from 'react-router-redux';

import { getSearchEntries } from '../../redux/actions/getSearchEntriesActions';

@connect((store) => {
  return {
    getSearchEntriesState: store.getSearchEntries.articleList,
  };
})

export default class Suche extends Component {
  state = {
    techObjectSearch: {},
    formStatus: 0,
    formMsg: ''
  }

  componentDidMount() {
    this.props.dispatch(getSearchEntries( [{}] ));
  }

  onChangeCheckboxSearch = (event, t, tValue) => {
      let checkValue = '';
      if(event.target.checked === true){
        checkValue = tValue;
      }
      let chObject = {}
      chObject[t] = checkValue;
      this.setState({ techObjectSearch: Object.assign(this.state.techObjectSearch, chObject) });
  }

  searchDB = () => {
      const searchQuery = this.refs.searchquery.value;
      const searchCategory = this.refs.categorySearch.value;
      const techObject = this.state.techObjectSearch;

      superagent
      .post('/searchQuery')
      .send({ searchQuery: searchQuery, searchCategory: searchCategory, techObject: techObject })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if(res.body.status === 1) {
          if(res.body.searchArticles.length > 0){
            this.props.dispatch(getSearchEntries(res.body.searchArticles));
          } else{
            this.setState({formStatus: 1});
            this.setState({formMsg: 'Leider ergab deine Suche keine Treffer.'});
          }
          scroll(0,0);
          console.log("yep search results: " + JSON.stringify(res.body.searchArticles));
        }
      })
  }

  loadArticle = (id) => {
    superagent
    .post('/getSpecificArticle')
    .send({ artId: id })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if(res.body.status === 1) {
        this.props.dispatch(push('community/'+res.body.specificArticleData.urlFriendlyTitel));
      }
    });
  }


  render() {
    const stylesCommunity = require('../Community/Community.scss');
    const stylesHome = require('../Home/Home.scss');
    const stylesMyProfile = require('../MyProfile/MyProfile.scss');

    const { getSearchEntriesState } = this.props;
    const { formStatus, formMsg } = this.state;

    console.log("getSearchEntriesState.articles: "+JSON.stringify(getSearchEntriesState.articles));
    console.log("length"+Object.keys(getSearchEntriesState.articles).length);
    let searchResults = [];
    if(Object.keys(getSearchEntriesState.articles).length > 0){
      getSearchEntriesState.articles.forEach(function(entry){
        searchResults.push(
          <div>
          <h3>Suchergebnisse</h3>
          <div onClick={() => this.loadArticle(entry.articleId)} className={stylesHome.topLine + ' animated fadeIn col-xs-12 ' + stylesHome.hover}>
            <div className='row'>
              <div className={'col-sm-1 col-xs-4 ' + stylesHome.mt5 + ' ' + stylesHome.mr35minus}>
                <div className={stylesMyProfile['avatar'+entry.userAvatar] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
                <div className={stylesMyProfile['flag'+entry.userKanton] + ' ' + stylesMyProfile.avatarRound + ' ' + stylesMyProfile.avatarMain + ' ' + stylesMyProfile.avatarMini}></div>
              </div>
              <div className={'col-sm-2 col-xs-8 ' + stylesHome.mt5 + ' ' + stylesHome.oh}>{entry.userNickname}</div>
              <div className={'col-sm-4 col-xs-12 ' + stylesHome.mt5 + ' ' + stylesHome.oh + ' ' + stylesHome.fs18}><strong>{entry.titel}</strong></div>
              <div className={'col-sm-3 col-xs-12 ' + stylesHome.techStyle + ' ' + stylesHome.mt5}>{ Object.keys(entry.technologies[0]).map(key => entry.technologies[0][key].length > 1 ? <span title={entry.technologies[0][key]} className={stylesCommunity.cbs00Home + ' ' + stylesCommunity['cbs'+key]}></span> : null ) }</div>
              <div className={'col-sm-2 col-xs-12 text-right ' + stylesHome.dateStyle + ' ' + stylesHome.mt5 + ' ' + stylesHome.mb10}>{entry.timeFormatted} | <strong>{entry.category}</strong></div>
            </div>
          </div>
          </div>
        );
      }.bind(this));
    }

    return (
        <div className="container searchPage">
          <h1>Suche</h1>
          <Helmet title="Suche"/>
          {formStatus === 1 ?
            <div dangerouslySetInnerHTML={{__html: formMsg}}></div>
            : null
          }
          {searchResults}

          <div className="form-group">
            <div className="row">
              <div className="col-xs-12 col-sm-10 col-md-10 col-lg-11">
                <input type="text" ref="searchquery" name="searchquery" id="searchquery" placeholder="Suche nach Schlagwörtern" autocorrect="off" autocapitalize="none" className="form-control"/>
              </div>
              <div className="search2 col-xs-12 col-sm-2 col-md-2 col-lg-1 text-right">
                <button className="btn btn-primary" onClick={() => this.searchDB()}>Suchen</button>
              </div>
            </div>
          </div>

          <div id="search-category-form">
            <form className="search-category-form form-inline">
              <div className="form-group">
                <select ref="categorySearch" className="titleStyle form-control">
                  <option value="Alles">Artikel + Projekte</option>
                  <option value="Artikel">Nur Artikel</option>
                  <option value="Projekt">Nur Projekte</option>
                </select>
              </div>
            </form>
          </div>

          <div>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't01', this.refs.t01.value)} ref="t01" value="React.js" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst01}> React.js
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't02', this.refs.t02.value)} ref="t02" value="React Router" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst02}> React Router
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't03', this.refs.t03.value)} ref="t03" value="Redux / Redux Saga" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst03}> Redux / Redux Saga
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't04', this.refs.t04.value)} ref="t04" value="React Router Redux" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst04}> React Router Redux
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't05', this.refs.t05.value)} ref="t05" value="Flux" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst05}> Flux
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't06', this.refs.t06.value)} ref="t06" value="Relay" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst06}> Relay
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't07', this.refs.t07.value)} ref="t07" value="GraphQL" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst07}> GraphQL
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't08', this.refs.t08.value)} ref="t08" value="Node.js" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst08}> Node.js
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't09', this.refs.t09.value)} ref="t09" value="MongoDB/Mongoose" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst09}> MongoDB/Mongoose
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't10', this.refs.t10.value)} ref="t10" value="MySQL" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst10}> MySQL
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't11', this.refs.t11.value)} ref="t11" value="Firebase" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst11}> Firebase
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't12', this.refs.t12.value)} ref="t12" value="Docker" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst12}> Docker
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't13', this.refs.t13.value)} ref="t13" value="AWS (EBS, S3, Lambda etc.)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst13}> AWS (EBS, S3, Lambda etc.)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't14', this.refs.t14.value)} ref="t14" value="Express/Koa/Hapi/Socket.io" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst14}> Express/Koa/Hapi/Socket.io
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't15', this.refs.t15.value)} ref="t15" value="JSX" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst15}> JSX
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't16', this.refs.t16.value)} ref="t16" value="Babel" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst16}> Babel
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't17', this.refs.t17.value)} ref="t17" value="Webpack" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst17}> Webpack
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't18', this.refs.t18.value)} ref="t18" value="Browserify" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst18}> Browserify
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't19', this.refs.t19.value)} ref="t19" value="Gulp" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst19}> Gulp
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't20', this.refs.t20.value)} ref="t20" value="Grunt" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst20}> Grunt
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't21', this.refs.t21.value)} ref="t21" value="ES6" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst21}> ES6
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't22', this.refs.t22.value)} ref="t22" value="ES7/ES8 (stage0)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst22}> ES7/ES8 (stage0)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't23', this.refs.t23.value)} ref="t23" value="React Native" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst23}> React Native
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't24', this.refs.t24.value)} ref="t24" value="CSS" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst24}> CSS
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't25', this.refs.t25.value)} ref="t25" value="Sass" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst25}> Sass
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't26', this.refs.t26.value)} ref="t26" value="Less" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst26}> Less
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't27', this.refs.t27.value)} ref="t27" value="Bootstrap/Foundation (oder ähnlich)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst27}> Bootstrap/Foundation (oder ähnlich)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't28', this.refs.t28.value)} ref="t28" value="Universal/Isomorphic (Serverside-Rendering)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst28}> Universal/Isomorphic (Serverside-Rendering)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't29', this.refs.t29.value)} ref="t29" value="Immutable.js" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst29}> Immutable.js
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't30', this.refs.t30.value)} ref="t30" value="Omnicient/Om" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst30}> Omnicient/Om
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't31', this.refs.t31.value)} ref="t31" value="Meteor" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst31}> Meteor
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't32', this.refs.t32.value)} ref="t32" value="Vue.js" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst32}> Vue.js
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't33', this.refs.t33.value)} ref="t33" value="ESLint/JSLint/JSHint (oder ähnlich)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst33}> ESLint/JSLint/JSHint (oder ähnlich)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't34', this.refs.t34.value)} ref="t34" value="Unit Tests - Mocha/Jasmine/Tape/Enzyme" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst34}> Unit Tests - Mocha/Jasmine/Tape/Enzyme
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't35', this.refs.t35.value)} ref="t35" value="Intergration Tests (e.g to a DB)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst35}> Intergration Tests (e.g to a DB)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't36', this.refs.t36.value)} ref="t36" value="Functional/E2E Tests (e.g. Selenium)" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst36}> Functional/E2E Tests (e.g. Selenium)
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't37', this.refs.t37.value)} ref="t37" value="Sonarqube" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst37}> Sonarqube
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't38', this.refs.t38.value)} ref="t38" value="iOS-App-Development" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst38}> iOS-App-Development
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't39', this.refs.t39.value)} ref="t39" value="Android-App-Development" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst39}> Android-App-Development
            </div></label>
            <label className={'checkbox-inline ' + stylesCommunity.cbs}>
              <input type="checkbox" onChange={(event) => this.onChangeCheckboxSearch(event, 't40', this.refs.t40.value)} ref="t40" value="Cordova/Phonegap" /> <div className={stylesCommunity.cbs00 + ' ' + stylesCommunity.cbst40}> Cordova/Phonegap
            </div></label>
          </div>
          <br />
          <button className="btn btn-primary" onClick={() => this.searchDB()}>Suchen</button>


        </div>
    );
  }

}
