import React, {Component} from 'react';
import Well from 'react-bootstrap/lib/Well';
import Alert from 'react-bootstrap/lib/Alert';
import { Draft, Editor, EditorState, ContentState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import CodeUtils from 'draft-js-code';
import { stateToHTML } from 'draft-js-export-html';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { Link } from 'react-router';
require('./Community.scss');

var PrismDecorator = require('draft-js-prism');

import { getBlogEntries } from '../../redux/actions/getBlogEntriesActions';

@connect((store) => {
  return {
    activateNewUserState: store.activateNewUser.userStatus,
    getBlogEntriesState: store.getBlogEntries.articleList,
  };
})

export default class RichEditorExample extends Component {
  state = {
    formStatus: 0,
    formMsg: '',
    techObject: [],
    t01: false, t02: false, t03: false, t04: false, t05: false, t06: false, t07: false, t08: false, t09: false, t10: false, t11: false, t12: false, t13: false, t14: false, t15: false, t16: false, t17: false, t18: false, t19: false, t20: false,
    t22: false, t23: false, t24: false, t25: false, t26: false, t27: false, t28: false, t29: false, t30: false, t31: false, t32: false, t33: false, t34: false, t35: false, t36: false, t37: false, t38: false, t39: false, t40: false
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
    superagent
    .post('/community')
    .send({ loadStatus: 1 })
    .set('Accept', 'application/json')
    .end((error, res) => {
      if (res.body.status === 1) {
        this.props.dispatch(getBlogEntries(res.body.blogArticles));
      }
    });
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

  onChangeCheckbox = (event, t, tValue) => {
    //let {t01, t02, t03} = false;
    let chObject = chObject || {};
    if(event.target.checked === true){
      chObject[t] = true;
    }else{
      chObject[t] = false;
    }
    console.log(chObject);
    /*
    const newItems = [t01, t02, t03];
    let tObject = [];
    tObject.push(...newItems);
    this.setState({ techObject: tObject });
    */
  }

  saveDataToDatabase() {
    const titelData = this.refs.titel.value;
    const categoryData = this.refs.category.value;
    const markupData = stateToHTML(this.state.editorState.getCurrentContent());
    const userUuid = cookie.load('ck_uuid');
    const userAvatar = cookie.load('ck_avatar');
    const userNickname = cookie.load('ck_nickname');
    const techObject = this.state.techObject;

    if(titelData.length > 2 && titelData.length < 60){
      if (markupData.length > 40) {

        superagent
        .post('/checkUniqueTitle')
        .send({ tryTitle: titelData })
        .set('Accept', 'application/json')
        .end((error, res) => {
          if(res.body.status === 1) {

              this.refs.titel.value = '';
              superagent
              .post('/community')
              .send({ loadStatus: 0, markupData: markupData, techObject: techObject, categoryData: categoryData, titelData: titelData, userUuid: userUuid, userAvatar: userAvatar, userNickname: userNickname })
              .set('Accept', 'application/json')
              .end((error, res) => {
                if (res.body.status === 1) {
                  this.props.dispatch(getBlogEntries(res.body.blogArticles));

                  /* Clear editor state */
                  const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
                  this.setState({ editorState });

                  this.setState({formStatus: 2});
                  this.setState({formMsg: 'Du hast erfolgreich einen Beitrag erstellt!'});
                }
              });

          } else{
            this.setState({formStatus: 1});
            this.setState({formMsg: 'Fehler: Es exisitiert bereits ein Beitrag mit dem genau gleichen Titel! Bitte verwende einen anderen Beitragstitel.'});
          }
        });

      } else{
        this.setState({formStatus: 1});
        this.setState({formMsg: 'Fehler: Ein Beitrag benötigt mindestens 40 Zeichen!'});
      }
    } else{
      this.setState({formStatus: 1});
      this.setState({formMsg: 'Fehler: Der Titel des Beitrages benötigt mindestens 3 Zeichen und darf 60 Zeichen nicht überschreiten!'});
    }
  }


  render() {
    const {formStatus, formMsg, editorState, techObject} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    let blogContentDef = '';

    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;"><h2 style="color: #d52b1e;">' + entry.titel + '</h2><hr />' + entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' + entry.userNickname + ' | ' + entry.timeFormatted + '</span></div>';
    });

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
                <option selected="selected" value="Artikel">Artikel - News / eigene Tutorials / Fragen</option>
                <option value="Projekt">Projekt - Stelle ein von dir erstelltes Web/App-Projekt vor</option>
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
        <div>{"AA: "+techObject}</div>
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
        <div>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't01', this.refs.t01.value)} ref="t01" value="React.js" /> React.js
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't02', this.refs.t02.value)} ref="t02" value="React Router" /> React Router
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't03', this.refs.t03.value)} ref="t03" value="Redux" /> Redux
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't04', this.refs.t04.value)} ref="t04" value="React Router Redux" /> React Router Redux
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't05', this.refs.t05.value)} ref="t05" value="Flux" /> Flux
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't06', this.refs.t06.value)} ref="t06" value="Relay" /> Relay
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't07', this.refs.t07.value)} ref="t07" value="GraphQL" /> GraphQL
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't08', this.refs.t08.value)} ref="t08" value="Node.js" /> Node.js
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't09', this.refs.t09.value)} ref="t09" value="MongoDB/Mongoose" /> MongoDB/Mongoose
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't10', this.refs.t10.value)} ref="t10" value="MySQL" /> MySQL
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't11', this.refs.t11.value)} ref="t11" value="Firebase" /> Firebase
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't12', this.refs.t12.value)} ref="t12" value="Docker" /> Docker
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't13', this.refs.t13.value)} ref="t13" value="AWS (EBS, S3, Lambda etc.)" /> AWS (EBS, S3, Lambda etc.)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't14', this.refs.t14.value)} ref="t14" value="Express/Koa/Hapi" /> Express/Koa/Hapi
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't15', this.refs.t15.value)} ref="t15" value="JSX" /> JSX
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't16', this.refs.t16.value)} ref="t16" value="Babel" /> Babel
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't17', this.refs.t17.value)} ref="t17" value="Webpack" /> Webpack
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't18', this.refs.t18.value)} ref="t18" value="Browserify" /> Browserify
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't19', this.refs.t19.value)} ref="t19" value="Gulp" /> Gulp
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't20', this.refs.t20.value)} ref="t20" value="Grunt" /> Grunt
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't21', this.refs.t21.value)} ref="t21" value="ES6" /> ES6
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't22', this.refs.t22.value)} ref="t22" value="ES7/ES8 (stage0)" /> ES7/ES8 (stage0)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't23', this.refs.t23.value)} ref="t23" value="React Native" /> React Native
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't24', this.refs.t24.value)} ref="t24" value="CSS" /> CSS
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't25', this.refs.t25.value)} ref="t25" value="Sass" /> Sass
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't26', this.refs.t26.value)} ref="t26" value="Less" /> Less
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't27', this.refs.t27.value)} ref="t27" value="Bootstrap/Foundation (oder ähnlich)" /> Bootstrap/Foundation (oder ähnlich)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't28', this.refs.t28.value)} ref="t28" value="Universal/Isomorphic (Serverside-Rendering)" /> Universal/Isomorphic (Serverside-Rendering)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't29', this.refs.t29.value)} ref="t29" value="Immutable.js" /> Immutable.js
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't30', this.refs.t30.value)} ref="t30" value="Omnicient/Om" /> Omnicient/Om
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't31', this.refs.t31.value)} ref="t31" value="Meteor" /> Meteor
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't32', this.refs.t32.value)} ref="t32" value="Vue.js" /> Vue.js
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't33', this.refs.t33.value)} ref="t33" value="ESLint/JSLint/JSHint (oder ähnlich)" /> ESLint/JSLint/JSHint (oder ähnlich)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't34', this.refs.t34.value)} ref="t34" value="Unit Tests - Mocha/Jasmine/Tape/Enzyme (oder ähnlich)" /> Unit Tests - Mocha/Jasmine/Tape/Enzyme (oder ähnlich)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't35', this.refs.t35.value)} ref="t35" value="Intergration Tests (e.g to a DB)" /> Intergration Tests (e.g to a DB)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't36', this.refs.t36.value)} ref="t36" value="Functional/E2E Tests (e.g. Selenium)" /> Functional/E2E Tests (e.g. Selenium)
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't37', this.refs.t37.value)} ref="t37" value="Sonarqube" /> Sonarqube
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't38', this.refs.t38.value)} ref="t38" value="iOS-App-Development" /> iOS-App-Development
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't39', this.refs.t39.value)} ref="t39" value="Android-App-Development" /> Android-App-Development
          </label>
          <label className="checkbox-inline">
            <input type="checkbox" onChange={(event) => this.onChangeCheckbox(event, 't40', this.refs.t40.value)} ref="t40" value="Cordova/Phonegap" /> Cordova/Phonegap
          </label>
        </div>
        <br />
        <button className="btn btn-primary" onClick={this.saveDataToDatabase.bind(this)}>Speichern</button>
        </div>
        :
        <Alert bsStyle="warning">Wenn du selbst Beiträge erfassen möchtest, erstelle jetzt <Link to="/registrieren">hier</Link> deinen eigenen Account.</Alert>
        }
        <div dangerouslySetInnerHTML={{__html: blogContentDef}}></div>
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
   {label: 'Code Block', style: 'code-block'},
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
