import React, {Component} from 'react';
import Well from 'react-bootstrap/lib/Well';
import Alert from 'react-bootstrap/lib/Alert';
import { Editor, AtomicBlockUtils, Draft, EditorState, Entity, ContentState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
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

    this.addMedia = this._addMedia.bind(this);
    this.addImage = this._addImage.bind(this);
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

  _addMedia(type) {
    const src = window.prompt('Enter a URL');
    if (!src) {
      return;
    }
    const entityKey = Entity.create(type, 'IMMUTABLE', {src});
    const {editorState} = this.state;
    const newState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '');
    //console.log(convertToRaw(editorState.getCurrentContent()), convertToRaw(newState.getCurrentContent()), Entity.get(entityKey));
    return newState;
  }

  _addImage() {
    this.onChange(this._addMedia('image'));
  }

  saveDataToDatabase() {
    const titelData = this.refs.titel.value;
    const markupData = stateToHTML(this.state.editorState.getCurrentContent());
    const userUuid = cookie.load('ck_uuid');
    const userAvatar = cookie.load('ck_avatar');
    const userNickname = cookie.load('ck_nickname');
    /* plus category and technologies */

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
              .send({ loadStatus: 0, markupData: markupData, titelData: titelData, userUuid: userUuid, userAvatar: userAvatar, userNickname: userNickname })
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
    const {formStatus, formMsg, editorState} = this.state;
    const { activateNewUserState, getBlogEntriesState } = this.props;
    const {name} = this.props.params;
    console.log(name);
    //const styles = require('./Community.scss');

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
        {(activateNewUserState.activatedUser === true && activateNewUserState.loggedInUser === true) || (cookie.load('ck_userLoggedIn') === true && cookie.load('ck_activation') === true) ?
        <div>
        {formStatus === 2 ?
          <Alert bsStyle="success"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
        : null
        }
        {formStatus === 1 ?
          <Alert bsStyle="danger"><div dangerouslySetInnerHTML={{__html: formMsg}}></div></Alert>
        : null
        }
        <div>Beitrag oder Projekt</div>
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
              blockRendererFn={mediaBlockRenderer}
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleReturn={this.handleReturn}
              onChange={this.onChange}
              onTab={this.onTab}
              placeholder=""
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
        <div>
					<button className="btn btn-primary" onMouseDown={this.addImage}>
						Bild hinzufügen
					</button>
        </div>
        <br />
        <div>Verwendete Technologien</div>
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


function mediaBlockRenderer(block) {
	if (block.getType() === 'atomic') {
		return {
			component: Media,
			editable: false
		};
	}
	return null;
}

const Image = (props) => {
	return <img src={props.src} />;
};

const Media = (props) => {

	const entity = Entity.get(props.block.getEntityAt(0));

	const {src} = entity.getData();
	const type = entity.getType();

	let media;
	if (type === 'image') {
		media = <Image src={src} />;
	}

	return media;
};



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
