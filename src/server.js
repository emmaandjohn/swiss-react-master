import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';
import cookieParser from 'cookie-parser';

if(!process.env.MONGODB_URI){
  process.env.MONGODB_URI = 'mongodb://heroku_r06n6jtm:5jf50mgg9941u4sd42f655q4kb@ds031915.mlab.com:31915/heroku_r06n6jtm';
}

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://'+config.app.settings.SenderEmail+':'+config.app.settings.SenderEmailPw+'@'+config.app.settings.SenderEmailSMTPHost);


const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

/* **** NODE-TIME */
var Moment = require('moment-timezone');

/* **** Mongoose */
var mongoose = require('mongoose');
//var textSearch = require('mongoose-text-search');
mongoose.connect(process.env.MONGODB_URI);
var userSchema = new mongoose.Schema({
  uuid: String,
  email: String,
  password: String,
  activation: Boolean,
  birthday: String,
  avatar: String,
  nickname: String,
  nicknameUrl: String,
  job: String,
  company: String,
  description: String,
  membersince: String,
  kanton: String,
  socialFb: String,
  socialGithub: String,
  socialTwitter: String,
  socialXing: String,
  socialWebsite: String
});
var UserModel = mongoose.model('User', userSchema);

var blogSchema = new mongoose.Schema({
  userUuid: String,
  userAvatar: String,
  userKanton: String,
  userNickname: String,
  nicknameUrl: String,
  category: String,
  titel: String,
  markup: String,
  technologies: Array,
  timeFormatted: String,
  unixtime: String,
  articleId: String,
  urlFriendlyTitel: String
});
blogSchema.index({titel: 'text', markup: 'text', nicknameUrl: 'text'});
var BlogModel = mongoose.model('Blog', blogSchema);


var commentsRatingSchema = new mongoose.Schema({
  category: String,
  targetArticleId: String,
  targetUuid: String,
  commentersUuid: String,
  commentersAvatar: String,
  commentersKanton: String,
  commentersNickname: String,
  commentersNicknameUrl: String,
  commentersTimestamp: String,
  rateOrCommentValue: String
});
var CommentsRatingModel = mongoose.model('CommentsRating', commentsRatingSchema);


app.use(cookieParser()); // use cookieParser for User-Cookies

/* **** Body Parser */
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/* **** Get POST Form data from Registration */
app.post('/registrieren', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var dateObject = new Date();
    var uniqueId =
         dateObject.getFullYear() + '' +
         dateObject.getMonth() + '' +
         dateObject.getDate() + '' +
         dateObject.getTime();

    var uuid = uniqueId+Math.random()+"s";

    var UserData = new UserModel({
      uuid: uuid,
      email: email,
      password: password,
      activation: false,
      birthday: null,
      avatar: 1,
      nickname: null,
      nicknameUrl: null,
      job: null,
      company: null,
      description: null,
      membersince: null,
      kanton: 0,
      socialFb: null,
      socialGithub: null,
      socialTwitter: null,
      socialXing: null,
      socialWebsite: null
    });

    UserModel.findOne({ email: email }, 'email', function(error, result){
        if(error){
            res.json(error);
        }
        else if(result == null){
            UserData.save(function (err) {
              if (err) return console.log(err);
            });
            var mailOptions = {
                from: '"Swiss React Community: Registrierung" <info@swiss-react.ch>',
                to: email,
                subject: 'Willkommen bei der Swiss React Community',
                text: 'Registrierung bestätigen',
                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>Willkommen bei Swiss-React.ch</title></head><body bgcolor="#8d8e90"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#8d8e90"> <tr> <td><table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" align="center"> <tr> <td><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td width="61"><a href="//www.swiss-react.ch" target="_blank"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_01.jpg" width="61" height="76" border="0" alt=""/></a></td><td width="144"><a href="//www.swiss-react.ch" target="_blank"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_02.jpg" width="144" height="76" border="0" alt=""/></a></td><td width="393"><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td height="30"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_04.jpg" width="393" height="30" border="0" alt=""/></td></tr></table></td></tr></table></td></tr><tr> <td align="center">&nbsp;</td></tr><tr> <td>&nbsp;</td></tr><tr> <td><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td width="10%">&nbsp;</td><td width="80%" align="left" valign="top"><font style="font-family: Georgia, Times, serif; color:#010101; font-size:24px"><strong><em>Willkommen bei Swiss-React.ch</em></strong></font><br/><br/> <font style="font-family: Verdana, Geneva, sans-serif; color:#666766; font-size:13px; line-height:21px">Wir freuen uns, dass du dich unserer Community anschliesst!<br/><br/>Bestätige bitte deine Registrierung mit dem untenstehenden Link:<br/><a href="http://www.swiss-react.ch/activation/?m='+email+'&u='+uuid+'">Anmeldung bestätigen</a><br/><br/>Freundliche Grüsse und willkommen an Bord,<br/>Swiss React Team</font></td><td width="10%">&nbsp;</td></tr></table></td></tr><tr> <td>&nbsp;</td></tr><tr> <td>&nbsp;</td></tr><tr> <td><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_07.jpg" width="598" height="7" style="display:block" border="0" alt=""/></td></tr><tr> <td>&nbsp;</td></tr><tr> <td align="center"><font style="font-family: Helvetica, Arial, sans-serif; color:#231f20; font-size:8px"><strong>Swiss React Community by Emma &amp; John | www.emmaandjohn.ch </strong></font></td></tr><tr> <td>&nbsp;</td></tr></table></td></tr></table></body></html>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            res.json({ status: 1, uuid: uuid });
        }
        else{
            res.json({ status: 0 });
        }
    });
});


/* **** rateOrComment */
app.post('/rateOrComment', function(req, res) {

    var category = req.body.category;
    var targetArticleId = req.body.targetArticleId;
    var targetUuid = req.body.targetUuid;
    var commentersUuid = req.body.commentersUuid;
    var commentersAvatar = req.body.commentersAvatar;
    var commentersKanton = req.body.commentersKanton;
    var commentersNickname = req.body.commentersNickname;
    var commentersNicknameUrl = req.body.commentersNicknameUrl;
    var rateOrCommentValue = req.body.rateOrCommentValue;

    var unixDateNow = Date.now(); // e.g. 1299827226
    var humanDate = Moment(unixDateNow).tz('Europe/Zurich').format('DD.MM.YYYY - HH:mm:ss');

    var CommentsOrRatingData = new CommentsRatingModel({
      category: category,
      targetArticleId: targetArticleId,
      targetUuid: targetUuid,
      commentersUuid: commentersUuid,
      commentersAvatar: commentersAvatar,
      commentersKanton: commentersKanton,
      commentersNickname: commentersNickname,
      commentersNicknameUrl: commentersNicknameUrl,
      commentersTimestamp: humanDate,
      rateOrCommentValue: rateOrCommentValue
    });

    CommentsOrRatingData.save(function (err) {
        if (err) {
          return console.log(err);
          res.json({ status: 0 });
        } else{
          res.json({ status: 1 });
        }
    });

});



/* **** Get POST Form data from Registration */
app.post('/login', function(req, res) {

    var email = req.body.email;
    var password = req.body.password;

    UserModel.findOne({ email: email, password: password, activation: true }, function(error, result){
        if(error){
            res.json(error);
        }
        else if(result !== null){
            res.json({ status: 1, userData: result });
        }
        else{
            res.json({ status: 0 });
        }
    });
});


/* **** Forgot PW */
app.post('/forgot', function(req, res) {

    var email = req.body.email;
    var getPw = '';

    UserModel.findOne({ email: email, activation: true }, 'password', function(error, result){
        if(error){
            res.json(error);
        }
        else if(result !== null){
            getPw = result.password;
            var mailOptions = {
                from: '"Swiss React Community: Passwort vergessen" <info@swiss-react.ch>',
                to: email,
                subject: 'Passwort erneut zugestellt',
                text: 'Passwort vergessen',
                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><title>Willkommen bei Swiss-React.ch</title></head><body bgcolor="#8d8e90"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#8d8e90"> <tr> <td><table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" align="center"> <tr> <td><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td width="61"><a href="//www.swiss-react.ch" target="_blank"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_01.jpg" width="61" height="76" border="0" alt=""/></a></td><td width="144"><a href="//www.swiss-react.ch" target="_blank"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_02.jpg" width="144" height="76" border="0" alt=""/></a></td><td width="393"><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td height="30"><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_01_04.jpg" width="393" height="30" border="0" alt=""/></td></tr></table></td></tr></table></td></tr><tr> <td align="center">&nbsp;</td></tr><tr> <td>&nbsp;</td></tr><tr> <td><table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td width="10%">&nbsp;</td><td width="80%" align="left" valign="top"><font style="font-family: Georgia, Times, serif; color:#010101; font-size:24px"><strong><em>Passwort vergessen</em></strong></font><br/><br/> <font style="font-family: Verdana, Geneva, sans-serif; color:#666766; font-size:13px; line-height:21px">Das Passwort für deinen Swiss-React.ch Account:<br/><br/><strong>'+getPw+'</strong><br/><br/>Solltest du kein Passwort von <a href="http://swiss-react.ch">swiss-react.ch</a> angefordert haben, bitten wir dich diese Email zu ignorieren.<br/>Dein Swiss React Team</font></td><td width="10%">&nbsp;</td></tr></table></td></tr><tr> <td>&nbsp;</td></tr><tr> <td>&nbsp;</td></tr><tr> <td><img src="https://s3.eu-central-1.amazonaws.com/swiss-react.ch/resources/img/PROMO-GREEN2_07.jpg" width="598" height="7" style="display:block" border="0" alt=""/></td></tr><tr> <td>&nbsp;</td></tr><tr> <td align="center"><font style="font-family: Helvetica, Arial, sans-serif; color:#231f20; font-size:8px"><strong>Swiss React Community by Emma &amp; John | www.emmaandjohn.ch </strong></font></td></tr><tr> <td>&nbsp;</td></tr></table></td></tr></table></body></html>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });
            res.json({ status: 1, pw: result });
        }
        else{
            res.json({ status: 0 });
        }
    });
});


/* **** Activation User */
app.post('/activation', function(req, res) {
    var queryM = req.body.queryM;
    var queryU = req.body.queryU;

    var unixDateNow = Date.now(); // e.g. 1299827226
    var humanDate = Moment(unixDateNow).tz('Europe/Zurich').format('DD.MM.YYYY - HH:mm:ss');

    var query = {"email": queryM, "uuid": queryU};
    var update = {activation: true, membersince: humanDate};
    var options = {new: true};
    UserModel.findOneAndUpdate(query, update, options, function(err, result) {
      if (err) {
        console.log('activation: got an error');
        res.json({ status: 0 });
      }
      else if(result !== null){
          res.json({ status: 1, membersince: humanDate });
      }
      else {
        res.json({ status: 0 });
      }
    });
});


/* **** deleteProfile */
app.post('/deleteProfile', function(req, res) {
    var deleteUuid = req.body.uuid;
    UserModel.findOne({ uuid: deleteUuid }, function(error, result){
      result.remove(function (err) {
        if (err) return console.log(err);
      });
    });

    var query11 = {"userUuid": deleteUuid};
    var options11 = {multi: true};

    BlogModel.find( query11, options11, function(err,docs){
      if (err) return console.log(err);
      if (!docs || !Array.isArray(docs) || docs.length === 0)
        return console.log('no docs found');
      docs.forEach( function (doc) {
        doc.remove();
      });
    });
    res.json({ status: 1 });
});


/* **** deleteArticles */
app.post('/deleteArticle', function(req, res) {
    var deleteArticleID = req.body.deleteArticleID;

    BlogModel.findOne({ "articleId": deleteArticleID }, function(err, result){
      result.remove(function (err) {
        if (err) return console.log(err);
      });
    });
    res.json({ status: 1 });
});

/* **** searchQuery - Suche */
app.post('/searchQuery', function(req, res) {
    var searchQuery = req.body.searchQuery;
    var searchCategory = req.body.searchCategory;
    var techObject = req.body.techObject;

    var techObjectArray = Object.keys(techObject).map(key => techObject[key].length > 1 ? key : '??');

    var newarr = techObjectArray.filter(function(a){return a !== '??'})

    if(searchCategory === 'Alles'){ searchCategory=['Artikel', 'Projekt']; }
    if(searchCategory === 'Projekt'){ searchCategory=['Projekt']; }
    if(searchCategory === 'Artikel'){ searchCategory=['Artikel']; }

    if(newarr.length > 0){
      if(searchQuery.length > 0){
        BlogModel.find({ $text:{$search:searchQuery}, 'category': {$in: searchCategory} }).sort({ score : { $meta : 'textScore' } }).exec(function(err, result) {
          var techFilteredObject; var counter=0;
          var result2 = [];
          for (var i = 0; i < result.length; i++) {
            counter=0;
            for (const key of Object.keys(result[i].technologies[0])) {
              if(result[i].technologies[0][key].length > 1){
                // 1. Durchlauf: t15, t17 vom Such-Beitrag1 // 2. Durchlauf: t15 von Such-Beitrag2
                if(newarr.indexOf(key) > -1){ // newarr: Angekreuzte Techn. Checkboxen, Beispiel: ["t15", "t17"]
                  counter++;
                  if(counter === newarr.length){
                    result2.push(result[i]);
                    counter=999;
                  }
                } else{
                  if(counter === newarr.length){
                    result2.push(result[i]);
                    counter=999;
                  }
                }
              }
            }
          }
          res.json({ status: 1, searchArticles: result2 });
        });
      } else{
        BlogModel.find({ 'category': {$in: searchCategory} }).sort({'category': 1, 'unixtime': -1}).exec(function(err, result) {
          var techFilteredObject; var counter=0;
          var result2 = [];
          for (var i = 0; i < result.length; i++) {
            counter=0;
            for (const key of Object.keys(result[i].technologies[0])) {
              if(result[i].technologies[0][key].length > 1){
                // 1. Durchlauf: t15, t17 vom Such-Beitrag1 // 2. Durchlauf: t15 von Such-Beitrag2
                if(newarr.indexOf(key) > -1){ // newarr: Angekreuzte Techn. Checkboxen, Beispiel: ["t15", "t17"]
                  counter++;
                  if(counter === newarr.length){
                    result2.push(result[i]);
                    counter=999;
                  }
                } else{
                  if(counter === newarr.length){
                    result2.push(result[i]);
                    counter=999;
                  }
                }
              }
            }
          }
          res.json({ status: 1, searchArticles: result2 });
        });
      }
    } else{
      BlogModel.find({ $text:{$search:searchQuery}, 'category': {$in: searchCategory} }).sort({'category': 1, 'unixtime': -1}).exec(function(err, result) {
        if(err){
          res.json(err);
          res.json({ status: 0 });
        }
        else if(result === null){
          res.json({ status: 0 });
        }
        else{
          res.json({ status: 1, searchArticles: result });
        }
      });
    }
});

/* **** checkUniqueTitle */
app.post('/checkUniqueTitle', function(req, res) {
    var titelOld = req.body.titelOld;
    var tryTitel = req.body.tryTitle;

    if(titelOld === tryTitel){ // EditTitle is same as before
      res.json({ status: 1 }); // title stays the same, all good...
    }
    else{
      var tryTitelConvert = tryTitel.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

      BlogModel.findOne({ urlFriendlyTitel: tryTitelConvert }, function(error, result){
        if(result === null){
          res.json({ status: 1 }); /* success */
        } else{
          res.json({ status: 0 }); /* title already exists */
        }
      });
    }
});

/* **** getSpecificArticle */
app.post('/getSpecificArticle', function(req, res) {
    var artId = req.body.artId;

    BlogModel.findOne({ articleId: artId }, function(error, result){
      if(result !== null){
        res.json({ status: 1, specificArticleData: result });
      }
    });
});

/* **** getSpecificArticleWithUrl */
app.post('/getSpecificArticleWithUrl', function(req, res) {
    var urlFriendlyBrowser = req.body.urlFriendly;

    BlogModel.findOne({ urlFriendlyTitel: urlFriendlyBrowser }, function(error, result){
      if(result !== null){
        res.json({ status: 1, specificArticleData: result });
      } else{
        res.json({ status: 0 });
      }
    });
});


/* **** Edit Article */
app.post('/editModeOn', function(req, res) {
    var artIdEdit = req.body.thisArtId;

    BlogModel.findOne({ articleId: artIdEdit }, function(error, result){
      if(result !== null){
        res.json({ status: 1, editArticleData: result });
      } else{
        res.json({ status: 0 });
      }
    });
});


/* **** Save new User-Post-Entry to database/mongoose */
app.post('/syncUserData', function(req, res) {
    var syncUserUuid = req.body.userUuid;

    UserModel.findOne({ uuid: syncUserUuid }, function(error, result){
      if(result !== null){
        res.json({ status: 1, userDataSync: result });
      } else{
        res.json({ status: 0 });
      }
    });
});

/* **** Check UserData FROM ANOTHER USER */
app.post('/syncUserData2', function(req, res) {
    var nicknameUrl = req.body.nicknameUrl;

    UserModel.findOne({ nicknameUrl: nicknameUrl }, function(error, result){
      if(result !== null){
        res.json({ status: 1, userDataSync: result });
      } else{
        res.json({ status: 0 });
      }
    });
});


/* **** Save new User-Post-Entry to database/mongoose */
app.post('/community', function(req, res) {
    var loadStatus = req.body.loadStatus;

    /* 1 = Community Load Data Initial - 2 = Home Load Data Initial */
    if(loadStatus === 1 || loadStatus === 2){
      let l = loadStatus === 2 ? 10 : 20;
      BlogModel.find({}).sort({'unixtime': -1}).limit(l).exec(function(err, result) {
        if(err){
          res.json(err);
          res.json({ status: 0 });
        }
        else if(result === null){
          res.json({ status: 0 });
        }
        else{
          res.json({ status: 1, blogArticles: result });
        }
      });
    }

    /* Save to Database and load data afterwards (0) OR editMode on (9) */
    if(loadStatus === 0 || loadStatus === 9){
      var editModeArtId = req.body.editModeArtId; /* only editmode = 9 - 'false' or ArticleID */
      var markupData = req.body.markupData;
      var titelData = req.body.titelData;
      var userUuid = req.body.userUuid;
      var userAvatar = req.body.userAvatar;
      var userKanton = req.body.userKanton;
      var userNickname = req.body.userNickname === null ? 'noob' : req.body.userNickname;
      var categoryData = req.body.categoryData;
      var techObject = req.body.techObject;

      markupData = markupData.replace(new RegExp('\n','g'), '');

      if(loadStatus === 0){
        var unixDateNow = Date.now(); // e.g. 1299827226
        var humanDate = Moment(unixDateNow).tz('Europe/Zurich').format('DD.MM.YYYY - HH:mm:ss');

        var dateObjectArticle = new Date();
        var uniqueIdArticle =
             dateObjectArticle.getFullYear() + '' +
             dateObjectArticle.getMonth() + '' +
             dateObjectArticle.getDate() + '' +
             dateObjectArticle.getTime();

        var articleIdDef = uniqueIdArticle+Math.random()+"artid";
      }

      /* make url-friendly-title */
      var urlFriendlyTitel = titelData.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
      var urlFriendlyNickname = userNickname.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

      /* 0 = NEW Article to Database */
      if(loadStatus === 0){
        var BlogData = new BlogModel({
          userUuid: userUuid,
          userAvatar: userAvatar,
          userKanton: userKanton,
          userNickname: userNickname,
          nicknameUrl: urlFriendlyNickname,
          category: categoryData,
          titel: titelData,
          markup: markupData,
          technologies: techObject,
          timeFormatted: humanDate,
          unixtime: unixDateNow,
          articleId: articleIdDef,
          urlFriendlyTitel: urlFriendlyTitel
        });
        UserModel.findOne({ uuid: userUuid }, 'uuid', function(error, result){
            if(error){
                res.json(error);
            }
            else if(result == null){
            }
            else{ /* Success: Save data to mongoose */
              BlogData.save(function (err) {
                if (err) {
                  return console.log(err);
                  res.json({ status: 0 });
                } else{
                  res.json({ status: 1, titlenew: urlFriendlyTitel });
                }
              });
            }
        });
      } else{
        /* 9 = Edit existing article and save to Database */
        BlogModel.findOne({ articleId: editModeArtId }, 'articleId', function(error, result){
          if(result !== null){
            var query2 = {"articleId": editModeArtId};
            var update2 = {'titel': titelData, 'urlFriendlyTitel': urlFriendlyTitel, 'markup': markupData, 'category': categoryData, 'technologies': techObject};
            var options2 = {multi: true};
            BlogModel.update(query2, update2, options2, function(err, result) {
              if (err) {
                console.log(err);
                res.json({ status: 0 });
              }
              else{
                res.json({ status: 1, titlenew: urlFriendlyTitel });
              }
            });
          }
        });
      }

    }
});



/* **** get Users Projects and Articles for MyProfile.js */
app.post('/getUserContent', function(req, res) {
    var contentUserUuid = req.body.userUuid;
    /* 1 = Community Load Data Initial - 2 = Home Load Data Initial */
    BlogModel.find({userUuid: contentUserUuid}).sort({'category': 1, 'unixtime': -1}).exec(function(err, result) {
      if(err){
        res.json(err);
        res.json({ status: 0 });
      }
      else if(result === null){
        res.json({ status: 0 });
      }
      else{
        res.json({ status: 1, blogArticles: result });
      }
    });
});
/* **** get Users Projects and Articles for MyProfile.js FROM ANOTHER USER */
app.post('/getUserContent2', function(req, res) {
    var nicknameUrl = req.body.nicknameUrl;
    /* 1 = Community Load Data Initial - 2 = Home Load Data Initial */
    BlogModel.find({nicknameUrl: nicknameUrl}).sort({'category': 1, 'unixtime': -1}).exec(function(err, result) {
      if(err){
        res.json(err);
        res.json({ status: 0 });
      }
      else if(result === null){
        res.json({ status: 0 });
      }
      else{
        res.json({ status: 1, blogArticles: result });
      }
    });
});




/* **** Activation User */
app.post('/updateUserProfile', function(req, res) {
    var getField = req.body.field;
    var getEmail = req.body.email;
    var getUuid = req.body.uuid;
    var newValue = req.body.newvalue;
    var nicknameUrl = 0;

    if(newValue.length > 0){

      if(getField === 'avatar' || getField === 'nickname' || getField === 'kanton'){
        var getField1 = '';
        if(getField === 'avatar'){getField1 = 'userAvatar';}
        if(getField === 'nickname'){getField1 = 'userNickname'; nicknameUrl = newValue.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-'); }
        if(getField === 'kanton'){getField1 = 'userKanton';}

        BlogModel.findOne({ userUuid: getUuid }, 'userUuid', function(error, result){
          if(result !== null){
            var query1 = {"userUuid": getUuid};
            var update1 = {}; var update2 = {}; /* update2: also update nicknameURL if getField is "nickname" ! */
            update1[getField1] = newValue; update2['nicknameUrl'] = nicknameUrl;
            var options1 = {multi: true};
            BlogModel.update(query1, update1, options1, function(err, result) {
              if (err) {
                console.log(err);
              }
              if(nicknameUrl !== 0){ /* also update nicknameURL ! */
                BlogModel.update(query1, update2, options1, function(err, result) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            });
          }
        });
      }

      var query = {"email": getEmail, "uuid": getUuid};
      var update = {}; var update3 = {}; /* update2: also update nicknameURL if getField is "nickname" ! */
      update[getField] = newValue; update3['nicknameUrl'] = nicknameUrl;
      var options = {new: true};
      UserModel.findOneAndUpdate(query, update, options, function(err, result) {
        if (err) {
          res.json({ status: 0 });
        }
        else if(result !== null){
          if(nicknameUrl !== 0){ /* also update nicknameURL ! */
            UserModel.findOneAndUpdate(query, update3, options, function(err, result) {
              if (err) {
                res.json({ status: 0 });
              }
              else if(result !== null){
                  res.json({ status: 1, userData: result }); /* also update nicknameURL ! */
              }
              else {
                res.json({ status: 0 });
              }
            });
          } else{
            res.json({ status: 1, userData: result }); /* also update nicknameURL ! */
          }
        }
        else {
          res.json({ status: 0 });
        }
      });
    } else{
        res.json({ status: 2 });
    }
});


app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', (req, res) => {
  proxy.web(req, res, {target: targetUrl});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
