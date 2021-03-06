/******************************************************************************
 * annotator.io.js
 *
 * Includes all server calls. Currently containing only fake calls!
 *
 *****************************************************************************/

/** @namespace Annotator */
var Annotator = Annotator || {};

/**
 *  The IO logic.
 *
 *  @memberof Annotator
 *  @namespace Annotator.IO
 */
Annotator.IO = (function () {
  'use strict';

  var
    /* @type {number} */
    currentTweetNum = 0,
    /* @type {boolean} */
    fakeSuccessStatus = true,
    /* @type {number} */
    fakeServerTimeOffset = 900,
    /* @type {array} */
    fakeTweets = [{
      tweet: 'Allen Ruiz by Yulia Gorbachenko >> www.inspirefirst.com/2015/05/29/all... Please RT #art #photography ',
      chosen: ''
    },{
      tweet:'Revisiting one book proposal and beginning a beginning of a draft of another. Inspired by folks lately',
      chosen: ''
    },{
      tweet:'gg @fragdolls',
      chosen: ''
    },{
      tweet:'ICYMI, #IndieCade15 submissions end in just a few days! Send in your indie game by June 1st: indiecade.com/submissions/',
      chosen: ''
    },{
      tweet:'Maison L by Loïc Picquet Architecte >> homeadore.com/2013/10/02/mai... Please RT #architecture #interiordesign',
      chosen: ''
    },{
      tweet:'Le 4 Screens, weils grad im Stream gefragt wurde. Foto ist doof und alt, aber man kanns ein bisschen erkennen :) ',
      chosen: ''
    },{
      tweet:'If you\'re in the UK & have old games/consoles you\'re willing to spare, do a good thing and donate them to hospitals for kids through @GWGUK',
      chosen: ''
    },{
      tweet:'Thanks to @playouya  people in #india enjoy high quality affordable games at home on TV. Such as @sonic_hedgehog ',
      chosen: ''
    },{
      tweet:'New website, new letters column! www.johnnywander.com byeeeee',
      chosen: ''
    },{
      tweet:'jersey: Karl, the man with no past; there are no more roads left to build; and the Bat Detector has found a 13th bat! #youhadtobethere',
      chosen: ''
    },{
      tweet:'Update! www.monsterkind.enenkay.com/comic/221',
      chosen: ''
    },{
      tweet: '@EnEnKay Um, read my comic imo',
      chosen: ''
    },{
      tweet: 'Aviator Apartment by mode:lina architekci >> homeadore.com/2013/11/27/avi... Please RT #architecture #interiordesign ',
      chosen: ''
    },{
      tweet: 'Who\'s coming to my 6:30pm panel at MomoCon? I have some announcements! If you aren\'t here, make sure you stay tuned to the site!',
      chosen: ''
    },{
      tweet: 'New: Hola VPN client vulnerabilities put millions of users at risk - www.bit.ly/1eEjm9B #0day',
      chosen: ''
    },{
      tweet: 'Get the top 5 Linux stories from the past week on http://Linux.com  (incl. updates on the 1st Android auto car!) www.bit.ly/1HX3oB3',
      chosen: ''
    },{
      tweet: 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      chosen: ''
    }];

  /* Fake Method ----------------------------------------------------------- */

  /**
   *  Sets annotation of current tweet and calls next tweet function.
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {string} annotation - chosen text
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakeSendAnnotation (annotation, callback) {
    fakeTweets[currentTweetNum].chosen = annotation;
    FakeNextTweet(callback);
  }
  
  /**
   *  Increments current tweet number and sends the current tweet.
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakeNextTweet (callback) {
    if (currentTweetNum != fakeTweets.length - 1) {
      currentTweetNum++;
    }
    FakeSendTweet(callback);
  }
  
  /**
   *  Decrements current tweet number and sends the current tweet. 
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakePreviousTweet (callback) {
    if (currentTweetNum != 0) {
      currentTweetNum--;
    }
    FakeSendTweet(callback);
  }
  
  /**
   *  Sends "fakeSuccessStatus" after s time delay.
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakePause (callback) {
    setTimeout(function () {
      callback({
        success: fakeSuccessStatus
      });
    }, fakeServerTimeOffset);
  }
  
  /**
   *  Just sends the current tweet. 
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakeResume (callback) {
    FakeSendTweet(callback);
  }
  
  /**
   *  Gets n-th tweet of fakeTweets.
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {number} num - number of tweet
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakeGetTweet (num, callback) {
    num--;

    if (num < 0) {
      num = 0;
    }
    else if (num > fakeTweets.length - 1) {
      num = fakeTweets.length - 1;
    }

    currentTweetNum = num;

    FakeSendTweet(callback);
  }

  /**
   *  Sends current tweet with chosen annotation after a time delay. Also:
   *
   *  - success - success of call
   *  - hasNext - there is a next tweet for annotation
   *  - hasPrevious - there is a previous tweet for annotation
   *  - countTweets - how many tweet exists for annotation
   *  - currentTweetNum - the id of current tweet
   *  - countAnnotatedTweets - how many are already annotated
   *
   *  @private
   *  @memberof Annotator.IO
   *  @inner
   *  @param {ioCallback} callback - callback function
   *  @return {undefined}    
   */
  function FakeSendTweet (callback) {
    setTimeout(function () {
      callback({
        tweet:                fakeTweets[currentTweetNum].tweet,
        chosen:               fakeTweets[currentTweetNum].chosen,
        success:              fakeSuccessStatus,
        hasNext:              currentTweetNum < fakeTweets.length -1,
        countTweets:          fakeTweets.length,
        hasPrevious:          currentTweetNum > 0,
        currentTweetNum:      currentTweetNum + 1,
        countAnnotatedTweets: fakeTweets.filter(function (t) {
          return t.chosen !== '';
        }).length
      });
    }, fakeServerTimeOffset);
  }

  /* Interface ------------------------------------------------------------- */

  /**
   *  Server json result.
   *
   *  @typedef ioCallJsonResult
   *  @type {Object}
   *  @property {string}  tweet - tweet text
   *  @property {string}  chosen - chosen annotation, if none: empty string
   *  @property {boolean} success - success of call
   *  @property {boolean} hasNext - there is a next tweet for annotation
   *  @property {boolean} hasPrevious - there is a previous tweet for annotation
   *  @property {number}  countTweets - how many tweet exists for annotation
   *  @property {number}  currentTweetNum - the id of current tweet
   *  @property {number}  countAnnotatedTweets - how many are already annotated
   */

  /**
   *  Callback server call
   *
   *  @callback ioCallback
   *  @param {ioCallJsonResult} json - Server json result.
   */

  return {

    /**
     *  Send annotation of tweet to server.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {string} annotation - chosen text 
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    SendAnnotation: function (annotation, callback) {
      FakeSendAnnotation(annotation, callback);
    },

    /**
     *  Requests next tweet.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    NextTweet: function (callback) {
      FakeNextTweet(callback);
    },

    /**
     *  Requests previous tweet.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    PreviousTweet: function (callback) {
      FakePreviousTweet(callback);
    },

    /**
     *  Send pause to server.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    Pause: function (callback) {
      FakePause(callback);
    },

    /**
     *  Send resume to server.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    Resume: function (callback) {
      FakeResume(callback);
    },

    /**
     *  Gets a specific tweet for annotation by number.
     *
     *  @public
     *  @memberof Annotator.IO
     *  @param {number} num - tweet number
     *  @param {ioCallback} callback - callback function
     *  @return {undefined}    
     */
    GetTweet: function (num, callback) {
      FakeGetTweet(num, callback);
    }
  };

}());
