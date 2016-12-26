import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import Well from 'react-bootstrap/lib/Well';
import Alert from 'react-bootstrap/lib/Alert';
import { Draft, Editor, EditorState, ContentState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import CodeUtils from 'draft-js-code';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { Link } from 'react-router';
require('./Community.scss');

var PrismDecorator = require('draft-js-prism');

//import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';
import { syncUserData } from '../../redux/actions/syncUserDataActions';

@connect((store) => {
  return {
    activateNewUserState: store.activateNewUser.userStatus,
    //getBlogEntriesState: store.getBlogEntries.articleList,
    syncUserDataState: store.syncUserData.userList,
  };
})

export default class RichEditorExample extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    techObject: {},
    editArticleData: {},
    optionsState: 'Artikel',
    editModeOnSwitchBtn: 0,
    tempEditArt: 'false'
  }

  constructor(props) {
    super(props);
    var decorator = new PrismDecorator();
    this.state = {editorState: EditorState.createEmpty(decorator)};

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.handleReturn = (e) => this._handleReturn(e);
    //this.keyBindingFn = (e) => this._keyBindingFn(e);

    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
  }

  componentDidMount() {
    /* EDIT ARTICLE MODE */
    this.setState({editModeOnSwitchBtn: 0})
    if(cookie.load('ck_tempEditArt') !== 'false'){
      this.setState({editModeOnSwitchBtn: 1})

      superagent
      .post('/editModeOn')
      .send({ thisArtId: cookie.load('ck_tempEditArt') })
      .set('Accept', 'application/json')
      .end((error, res) => {
        if(res.body.status === 1) {

          /* set markup */
          const newContentState = stateFromHTML(res.body.editArticleData.markup)
          const editorState = EditorState.push(this.state.editorState, newContentState)
          this.setState({editorState})

          /* set titel */
          this.refs.titel.value = res.body.editArticleData.titel;

          /* set category */
          this.setState({optionsState: res.body.editArticleData.category})

          /* set technologies */
          for (let key in res.body.editArticleData.technologies[0]) {
                if(res.body.editArticleData.technologies[0][key].length > 1){
                  this.refs[key].checked = true;
                  this.onChangeCheckbox(null, key, res.body.editArticleData.technologies[0][key], true);
                }
          }


        } else{
          console.log("Error, Article url does not exist in DB");
        }
      });
    }

    this.setState({ techObject: {} });
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
}

  _handleReturn(e) {
      var editorState = this.state.editorState;

      if (!CodeUtils.hasSelectionInBlock(editorState)) {
          return;
      }
      this.onChange(
          CodeUtils.handleReturn(e, editorState)
      );
      return true;
  }

  _onTab(e) {
    /*const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));*/
    var editorState = this.state.editorState;
    if (!CodeUtils.hasSelectionInBlock(editorState)) {
        return;
    }
    this.onChange(
        CodeUtils.handleTab(e, editorState)
    );
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  onChangeCheckbox = (event, t, tValue, editMode) => {
    if(editMode === true){
      let chObjectEdit = {}
      chObjectEdit[t] = tValue;
      this.setState({ techObject: Object.assign(this.state.techObject, chObjectEdit) });
    } else {
      let checkValue = '';
      if(event.target.checked === true){
        checkValue = tValue;
      }
      let chObject = {}
      chObject[t] = checkValue;
      this.setState({ techObject: Object.assign(this.state.techObject, chObject) });
    }
  }


  saveDataToDatabase = (editModeOn) => {
    const titelData = this.refs.titel.value;
    const categoryData = this.refs.category.value;
    const markupData = stateToHTML(this.state.editorState.getCurrentContent());
    const userUuid = cookie.load('ck_uuid');

    let loadStatus = 0;
    let titelExtra = 0;
    let successMsg = 'Du hast erfolgreich einen Beitrag erstellt!';
    if(editModeOn === 1){
      loadStatus = 9; successMsg = 'Du hast erfolgreich deinen Beitrag aktualisiert!'; titelExtra = titelData;
    }

    superagent
    .post('/syncUserData')
    .send({ userUuid: userUuid })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        const userAvatar = res.body.userDataSync.avatar;
        const userNickname = res.body.userDataSync.nickname;
        const userKanton = res.body.userDataSync.kanton;

        const techObject = this.state.techObject;

        if(titelData.length > 2 && titelData.length < 120){
          if (markupData.length > 40) {
            if(Object.keys(techObject).length > 0){

              superagent
              .post('/checkUniqueTitle')
              .send({ tryTitle: titelData, titelExtra: titelExtra })
              .set('Accept', 'application/json')
              .end((error, res) => {
                if(res.body.status === 1) {

                    this.refs.titel.value = '';
                    superagent
                    .post('/community')
                    .send({ loadStatus: loadStatus, markupData: markupData, techObject: techObject, categoryData: categoryData, titelData: titelData, userUuid: userUuid, userAvatar: userAvatar, userKanton: userKanton, userNickname: userNickname, editModeArtId: cookie.load('ck_tempEditArt') })
                    .set('Accept', 'application/json')
                    .end((error, res) => {
                      if (res.body.status === 1) {
                        //this.props.dispatch(getBlogEntries(res.body.blogArticles));
                        cookie.save('ck_tempEditArt', 'false', { path: '/', expires: new Date(new Date().getTime() + (3600*3600*3600)) });
                        /* Clear editor state */
                        let editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
                        this.setState({ editorState });

                        this.setState({formStatus: 2});
                        this.setState({formMsg: successMsg});
                        scroll(0,0);
                        let counter = '';
                        for(let i=1; i<41; i++){
                          if(i < 10){
                            counter = "t0"+i;
                          } else{counter = "t"+i;}
                          this.refs[counter].checked = false;
                        }
                      }
                    });

                } else{
                  this.setState({formStatus: 1});
                  this.setState({formMsg: 'Fehler: Es exisitiert bereits ein Beitrag mit dem genau gleichen Titel! Bitte verwende einen anderen Beitragstitel.'});
                  scroll(0,0);
                }
              });

            } else{
              this.setState({formStatus: 1});
              this.setState({formMsg: 'Fehler: Bitte wähle mindestens eine Technologie aus!'});
              scroll(0,0);
            }
          } else{
            this.setState({formStatus: 1});
            this.setState({formMsg: 'Fehler: Ein Beitrag benötigt mindestens 40 Zeichen!'});
            scroll(0,0);
          }
        } else{
          this.setState({formStatus: 1});
          this.setState({formMsg: 'Fehler: Der Titel des Beitrages benötigt mindestens 3 Zeichen und darf 120 Zeichen nicht überschreiten!'});
          scroll(0,0);
        }
      }

      });
    }


  render() {
    const {formStatus, formMsg, editorState, techObject} = this.state;
    const { activateNewUserState } = this.props;
    const styles = require('./Community.scss');

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }


    return (
      <div className="container" id="communityPage">
        <h1>Community</h1>
        <Helmet title="Community"/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === 'true' && cookie.load('ck_activation') === 'true') ?
        <div>
        {formStatus === 2 ?
          <Alert bsStyle="success"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
        : null
        }
        {formStatus === 1 ?
          <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
        : null
        }
        <div id="community-category-form">
          <form className="community-category-form form-inline">
            <div className="form-group">
              <select ref="category" className="titleStyle form-control">
                <option selected={this.state.optionsState === 'Artikel'} value="Artikel">Artikel - News / eigene Tutorials / Fragen</option>
                <option selected={this.state.optionsState === 'Projekt'} value="Projekt">Projekt - Stelle ein von dir erstelltes Web/App-Projekt vor</option>
              </select>
            </div>
          </form>
        </div>
        <div id="community-title-form">
          <form className="community-title-form form-inline">
            <div className="form-group">
              <input type="text" ref="titel" name="titel" id="titel" placeholder="Titel" className="titleStyle form-control"/>
            </div>
          </form>
        </div>
        <div className="RichEditor-root">
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
              />
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
              />
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleReturn={this.handleReturn}
              onChange={this.onChange}
              //keyBindingFn={this.keyBindingFn}
              onTab={this.onTab}
              placeholder=""
              ref="editor"
              spellCheck={true}
              />
          </div>
        </div>
        <br />
        <span className={styles.dateStyle}>* Drücke innerhalb eines Code Block CTRL+Enter um einen neuen Codeblock hinzuzufügen.</span>
        <br /><br /><br />
        <div>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't01', this.refs.t01.value)} ref="t01" value="React.js" /> <div className={styles.cbs00 + ' ' + styles.cbst01}> React.js
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't02', this.refs.t02.value)} ref="t02" value="React Router" /> <div className={styles.cbs00 + ' ' + styles.cbst02}> React Router
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't03', this.refs.t03.value)} ref="t03" value="Redux / Redux Saga" /> <div className={styles.cbs00 + ' ' + styles.cbst03}> Redux / Redux Saga
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't04', this.refs.t04.value)} ref="t04" value="React Router Redux" /> <div className={styles.cbs00 + ' ' + styles.cbst04}> React Router Redux
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't05', this.refs.t05.value)} ref="t05" value="Flux" /> <div className={styles.cbs00 + ' ' + styles.cbst05}> Flux
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't06', this.refs.t06.value)} ref="t06" value="Relay" /> <div className={styles.cbs00 + ' ' + styles.cbst06}> Relay
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't07', this.refs.t07.value)} ref="t07" value="GraphQL" /> <div className={styles.cbs00 + ' ' + styles.cbst07}> GraphQL
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't08', this.refs.t08.value)} ref="t08" value="Node.js" /> <div className={styles.cbs00 + ' ' + styles.cbst08}> Node.js
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't09', this.refs.t09.value)} ref="t09" value="MongoDB/Mongoose" /> <div className={styles.cbs00 + ' ' + styles.cbst09}> MongoDB/Mongoose
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't10', this.refs.t10.value)} ref="t10" value="MySQL" /> <div className={styles.cbs00 + ' ' + styles.cbst10}> MySQL
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't11', this.refs.t11.value)} ref="t11" value="Firebase" /> <div className={styles.cbs00 + ' ' + styles.cbst11}> Firebase
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't12', this.refs.t12.value)} ref="t12" value="Docker" /> <div className={styles.cbs00 + ' ' + styles.cbst12}> Docker
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't13', this.refs.t13.value)} ref="t13" value="AWS (EBS, S3, Lambda etc.)" /> <div className={styles.cbs00 + ' ' + styles.cbst13}> AWS (EBS, S3, Lambda etc.)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't14', this.refs.t14.value)} ref="t14" value="Express/Koa/Hapi/Socket.io" /> <div className={styles.cbs00 + ' ' + styles.cbst14}> Express/Koa/Hapi/Socket.io
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't15', this.refs.t15.value)} ref="t15" value="JSX" /> <div className={styles.cbs00 + ' ' + styles.cbst15}> JSX
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't16', this.refs.t16.value)} ref="t16" value="Babel" /> <div className={styles.cbs00 + ' ' + styles.cbst16}> Babel
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't17', this.refs.t17.value)} ref="t17" value="Webpack" /> <div className={styles.cbs00 + ' ' + styles.cbst17}> Webpack
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't18', this.refs.t18.value)} ref="t18" value="Browserify" /> <div className={styles.cbs00 + ' ' + styles.cbst18}> Browserify
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't19', this.refs.t19.value)} ref="t19" value="Gulp" /> <div className={styles.cbs00 + ' ' + styles.cbst19}> Gulp
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't20', this.refs.t20.value)} ref="t20" value="Grunt" /> <div className={styles.cbs00 + ' ' + styles.cbst20}> Grunt
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't21', this.refs.t21.value)} ref="t21" value="ES6" /> <div className={styles.cbs00 + ' ' + styles.cbst21}> ES6
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't22', this.refs.t22.value)} ref="t22" value="ES7/ES8 (stage0)" /> <div className={styles.cbs00 + ' ' + styles.cbst22}> ES7/ES8 (stage0)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't23', this.refs.t23.value)} ref="t23" value="React Native" /> <div className={styles.cbs00 + ' ' + styles.cbst23}> React Native
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't24', this.refs.t24.value)} ref="t24" value="CSS" /> <div className={styles.cbs00 + ' ' + styles.cbst24}> CSS
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't25', this.refs.t25.value)} ref="t25" value="Sass" /> <div className={styles.cbs00 + ' ' + styles.cbst25}> Sass
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't26', this.refs.t26.value)} ref="t26" value="Less" /> <div className={styles.cbs00 + ' ' + styles.cbst26}> Less
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't27', this.refs.t27.value)} ref="t27" value="Bootstrap/Foundation (oder ähnlich)" /> <div className={styles.cbs00 + ' ' + styles.cbst27}> Bootstrap/Foundation (oder ähnlich)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't28', this.refs.t28.value)} ref="t28" value="Universal/Isomorphic (Serverside-Rendering)" /> <div className={styles.cbs00 + ' ' + styles.cbst28}> Universal/Isomorphic (Serverside-Rendering)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't29', this.refs.t29.value)} ref="t29" value="Immutable.js" /> <div className={styles.cbs00 + ' ' + styles.cbst29}> Immutable.js
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't30', this.refs.t30.value)} ref="t30" value="Omnicient/Om" /> <div className={styles.cbs00 + ' ' + styles.cbst30}> Omnicient/Om
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't31', this.refs.t31.value)} ref="t31" value="Meteor" /> <div className={styles.cbs00 + ' ' + styles.cbst31}> Meteor
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't32', this.refs.t32.value)} ref="t32" value="Vue.js" /> <div className={styles.cbs00 + ' ' + styles.cbst32}> Vue.js
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't33', this.refs.t33.value)} ref="t33" value="ESLint/JSLint/JSHint (oder ähnlich)" /> <div className={styles.cbs00 + ' ' + styles.cbst33}> ESLint/JSLint/JSHint (oder ähnlich)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't34', this.refs.t34.value)} ref="t34" value="Unit Tests - Mocha/Jasmine/Tape/Enzyme" /> <div className={styles.cbs00 + ' ' + styles.cbst34}> Unit Tests - Mocha/Jasmine/Tape/Enzyme
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't35', this.refs.t35.value)} ref="t35" value="Intergration Tests (e.g to a DB)" /> <div className={styles.cbs00 + ' ' + styles.cbst35}> Intergration Tests (e.g to a DB)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't36', this.refs.t36.value)} ref="t36" value="Functional/E2E Tests (e.g. Selenium)" /> <div className={styles.cbs00 + ' ' + styles.cbst36}> Functional/E2E Tests (e.g. Selenium)
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't37', this.refs.t37.value)} ref="t37" value="Sonarqube" /> <div className={styles.cbs00 + ' ' + styles.cbst37}> Sonarqube
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't38', this.refs.t38.value)} ref="t38" value="iOS-App-Development" /> <div className={styles.cbs00 + ' ' + styles.cbst38}> iOS-App-Development
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't39', this.refs.t39.value)} ref="t39" value="Android-App-Development" /> <div className={styles.cbs00 + ' ' + styles.cbst39}> Android-App-Development
          </div></label>
          <label className={'checkbox-inline ' + styles.cbs}>
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't40', this.refs.t40.value)} ref="t40" value="Cordova/Phonegap" /> <div className={styles.cbs00 + ' ' + styles.cbst40}> Cordova/Phonegap
          </div></label>
        </div>
        <br />
          {this.state.editModeOnSwitchBtn === 0 ?
          <button className="btn btn-primary" onClick={() => this.saveDataToDatabase(0)}>Speichern</button>
          :
          <button className="btn btn-primary" onClick={() => this.saveDataToDatabase(1)}>Speichern</button>
          }
        </div>
        :
        <Alert bsStyle="warning">Wenn du selbst Beiträge erfassen möchtest, erstelle jetzt <Link to="/registrieren">hier</Link> deinen eigenen Account.</Alert>
        }
      </div>
    );
  }
}

 const styleMap = {
   CODE: {
     backgroundColor: 'rgba(0, 0, 0, 0.05)',
     fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
     fontSize: 16,
     padding: 2,
   },
 };

 function getBlockStyle(block) {
   switch (block.getType()) {
     case 'blockquote': return 'RichEditor-blockquote';
     case 'code-block': return 'language-css';
     default: return null;
   }
 }

 class StyleButton extends Component {
   constructor() {
     super();
     this.onToggle = (e) => {
       e.preventDefault();
       this.props.onToggle(this.props.style);
     };
   }

   render() {
     let className = 'RichEditor-styleButton';
     if (this.props.active) {
       className += ' RichEditor-activeButton';
     }

     return (
       <span className={className} onMouseDown={this.onToggle}>
         {this.props.label}
       </span>
     );
   }
 }

 const BLOCK_TYPES = [
   /*{label: 'H1', style: 'header-one'},
   {label: 'H2', style: 'header-two'},
   {label: 'H3', style: 'header-four'},*/
   {label: 'Headline', style: 'header-three'},
   /*{label: 'H5', style: 'header-five'},
   {label: 'H6', style: 'header-six'},*/
   {label: 'Blockquote', style: 'blockquote'},
   {label: 'UL', style: 'unordered-list-item'},
   {label: 'OL', style: 'ordered-list-item'},
   {label: 'Code Block*', style: 'code-block'},
 ];

 const BlockStyleControls = (props) => {
   const {editorState} = props;
   const selection = editorState.getSelection();
   const blockType = editorState
     .getCurrentContent()
     .getBlockForKey(selection.getStartKey())
     .getType();

   return (
     <div className="RichEditor-controls">
       {BLOCK_TYPES.map((type) =>
         <StyleButton
           key={type.label}
           active={type.style === blockType}
           label={type.label}
           onToggle={props.onToggle}
           style={type.style}
         />
       )}
     </div>
   );
 };

 var INLINE_STYLES = [
   {label: 'Bold', style: 'BOLD'},
   {label: 'Italic', style: 'ITALIC'},
   {label: 'Underline', style: 'UNDERLINE'}
   /*{label: 'Monospace', style: 'CODE'},*/
 ];

 const InlineStyleControls = (props) => {
   var currentStyle = props.editorState.getCurrentInlineStyle();
   return (
     <div className="RichEditor-controls">
       {INLINE_STYLES.map(type =>
         <StyleButton
           key={type.label}
           active={currentStyle.has(type.style)}
           label={type.label}
           onToggle={props.onToggle}
           style={type.style}
         />
       )}
     </div>
   );
 };
