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
    formMsg: ''
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

  /*_keyBindingFn(e) {
      var editorState = this.state.editorState;
      var command;

      if (CodeUtils.hasSelectionInBlock(editorState)) {
          command = CodeUtils.getKeyBinding(e);
      }
      if (command) {
          return command;
      }

      return Draft.getDefaultKeyBinding(e);
  }*/

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

  saveDataToDatabase() {
    const titelData = this.refs.titel.value;
    const markupData = stateToHTML(this.state.editorState.getCurrentContent());
    const userEmail = cookie.load('ck_email');

    if(titelData.length > 2 && titelData.length < 60){
      if (markupData.length > 40) {
        this.refs.titel.value = '';
        superagent
        .post('/community')
        .send({ loadStatus: 0, markupData: markupData, titelData: titelData, userEmail: userEmail })
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
        this.setState({formMsg: 'Fehler: Ein Beitrag benötigt mindestens 40 Zeichen!'});
      }
    } else{
      this.setState({formStatus: 1});
      this.setState({formMsg: 'Fehler: Der Titel des Beitrages benötigt mindestens 3 Zeichen und darf 60 Zeichen nicht überschreiten!'});
    }
  }

  render() {
    const {draftjsStatus, draftjsMsg, editorState} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;
    //const styles = require('./Community.scss');

    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    let blogContentDef = '';
    /*getBlogEntriesState.articles.sort(function(a, b){
        return b.unixtime-a.unixtime
    });*/
    getBlogEntriesState.articles.forEach(function(entry){
      blogContentDef += '<div style="background-color: #FDFDFD; border: 1px dotted #C8C8C8; padding: 12px; margin: 30px auto;"><h2 style="color: #d52b1e;">' + entry.titel + '</h2><hr />' + entry.markup + '<br><span style="font-size: 10px; font-style: italic; color: grey;">Author: ' + entry.userEmail + ' | ' + entry.timeFormatted + '</span></div>';
    });

    return (
      <div className="container" id="communityPage">
        <h1>Community</h1>
        <Helmet title="Community"/>
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
        <div>
        {formStatus === 2 ?
          <Alert bsStyle="success" dangerouslySetInnerHTML={{__html: formMsg}}></Alert>
        : null
        }
        {formStatus === 1 ?
          <Alert bsStyle="danger" dangerouslySetInnerHTML={{__html: formMsg}}></Alert>
        : null
        }
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
