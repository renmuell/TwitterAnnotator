/******************************************************************************
 * annotator.js
 *
 * Contains the frontend logic of the annotator.
 *
 *****************************************************************************/

/* global Annotator, Rainbow */

/** @namespace Annotator */
var Annotator = Annotator || {};

/**
 *  The user interface logic
 *
 *  @memberof Annotator
 *  @namespace Annotator.UI
 */
Annotator.UI = (function(){

  'use strict';

  var
    /* @type {Element} */
    annotatorElm,
    /* @type {boolean} */
    userSetUrlHash,

    /* @type {Element} */
    nav,
    /* @type {Element} */
    form,
    /* @type {Element} */
    goBtn,
    /* @type {Element} */
    nextBtn,
    /* @type {Element} */
    helpBtn,
    /* @type {Element} */
    pauseBtn,
    /* @type {Element} */
    statusBtn,
    /* @type {Element} */
    neutralBtn,
    /* @type {Element} */
    helpContent,
    /* @type {Element} */
    previousBtn,
    /* @type {Element} */
    tweetContent,
    /* @type {Element} */
    closeHelpBtn,
    /* @type {Element} */
    irrelevantBtn,
    /* @type {Element} */
    opinionatedBtn,

    /* @type {object} */
    KeyCodes = {
      q:81,
      e:69,
      w:87,
      a:65,
      s:83,
      c:67,
      d:68
    };

  /* Action Handler -------------------------------------------------------- */

  /**
   *  Keyboard event on pressing down.
   *
   *  @param {KeyboardEvent} event - keydown event
   *  @return {undefined}
   */
  function Document_KeyDownHandler(event){
    if (event.keyCode === KeyCodes.w) {
      ShowButtonPress(helpBtn);
    } else if (!annotatorElm.classList.contains('pause')) {
      switch(event.keyCode){
        case KeyCodes.q : ShowButtonPress(previousBtn);    break;
        case KeyCodes.e : ShowButtonPress(nextBtn);        break;
        case KeyCodes.a : ShowButtonPress(irrelevantBtn);  break;
        case KeyCodes.s : ShowButtonPress(neutralBtn);     break;
        case KeyCodes.d : ShowButtonPress(opinionatedBtn); break;
        case KeyCodes.c : ShowButtonPress(pauseBtn);
      }
    } else if (annotatorElm.classList.contains('pause') && event.keyCode == KeyCodes.c){
      ShowButtonPress(goBtn);
    }
  }

  /**
   *  Keyboard event on releasing up.
   *
   *  @param {KeyboardEvent} event - keyup event
   *  @return {undefined}
   */
  function Document_KeyUpHandler(event){
    ShowButtonPressReset();

    if (event.keyCode === KeyCodes.w) {
      ToggleHelp();
    } else if (!annotatorElm.classList.contains('pause') && !helpContent.classList.contains('open')) {
      switch(event.keyCode){
        case KeyCodes.q : GetTweet(Annotator.IO.PreviousTweet); break;
        case KeyCodes.e : GetTweet(Annotator.IO.NextTweet);     break;
        case KeyCodes.a : SendAnnotation('Irrelevant');         break;
        case KeyCodes.s : SendAnnotation('Neutral');            break;
        case KeyCodes.d : SendAnnotation('Opinionated');        break;
        case KeyCodes.c : SendPause();
      }
    } else if (annotatorElm.classList.contains('pause') && event.keyCode == KeyCodes.c){
      SendResume();
    }
  }

  /**
   *  ClickHanlder for PauseBtn.
   *
   *  @return {undefined}    
   */
  function PauseBtn_ClickHandler(){
    pauseBtn.blur();
    SendPause();
  }

  /**
   *  ClickHanlder for GoBtn.
   *
   *  @return {undefined}    
   */
  function GoBtn_ClickHandler(){
    goBtn.blur();
    SendResume();
  }

  /**
   *  ClickHanlder for PreviousBtn.
   *
   *  @return {undefined}    
   */
  function PreviousBtn_ClickHandler(){
    previousBtn.blur();
    GetTweet(Annotator.IO.PreviousTweet);
  }

  /**
   *  ClickHanlder for NextBtn.
   *
   *  @return {undefined}    
   */
  function NextBtn_ClickHandler(){
    nextBtn.blur();
    GetTweet(Annotator.IO.NextTweet);
  }

  /**
   *  ClickHanlder for HelpBtn.
   *
   *  @return {undefined}    
   */
  function HelpBtn_ClickHandler(){
    helpBtn.blur();
    if (!helpBtn.classList.contains('open')) {
      ToggleHelp();
    }
  }

  /**
   *  ClickHanlder for PauseBtn.
   *
   *  @param {Event} event - submit event
   *  @return {undefined}    
   */
  function Form_SubmitHandler(event) {
    event.preventDefault();
  }

  /**
   *  ClickHanlder for NeutralBtn.
   *
   *  @return {undefined}    
   */
  function NeutralBtn_ClickHanlder() {
    neutralBtn.blur();
    SendAnnotation('Neutral');
  }

  /**
   *  ClickHanlder for IrrelevantBtn.
   *
   *  @return {undefined}
   */
  function IrrelevantBtn_ClickHanlder() {
    irrelevantBtn.blur();
    SendAnnotation('Irrelevant');
  }

  /**
   *  ClickHanlder for OpinionatedBtn.
   *
   *  @return {undefined}
   */
  function OpinionatedBtn_ClickHanlder() {
    opinionatedBtn.blur();
    SendAnnotation('Opinionated');
  }

  /**
   *  Show button press state by toggle active class on.
   *
   *  @param {Element} elm - the element
   *  @return {undefined}
   */
  function ShowButtonPress(elm){
    elm.classList.toggle('active');
  }

  /**
   *  Reset button press state of all used buttons by toggle active class off.
   *
   *  @return {undefined}
   */
  function ShowButtonPressReset(){
    [
      goBtn,
      nextBtn,
      helpBtn,
      pauseBtn,
      neutralBtn,
      previousBtn,
      irrelevantBtn,
      opinionatedBtn
    ].forEach(function(b){ 
      b.classList.remove('active');
    });
  }

  /* HELP ------------------------------------------------------------------ */

  /**
   *  Open or close the help.
   *
   *  @return {undefined}
   */
  function ToggleHelp(){
    helpContent.classList.toggle('open');
  }

  /* IO -------------------------------------------------------------------- */

  /**
   *  Send pause to server.
   *
   *  @return {undefined}
   */
  function SendPause() {
    SetTweet('');
    annotatorElm.classList.add('loading');
    Annotator.IO.Pause(function(json) {
      if (json.success) {
        goBtn.querySelector('span').innerHTML = 'Continue'; 
        annotatorElm.classList.remove('loading');
        annotatorElm.classList.add('pause');
      }
    });
  }

  /**
   *  Send resume to server.
   *
   *  @return {undefined}
   */
  function SendResume(){
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    Annotator.IO.Resume(AnnotatorIO_TweetHandler);
  }

  /**
   *  Send annotation of tweet to server.
   *
   *  @param {string} annotation - chosen text
   *  @return {undefined}
   */
  function SendAnnotation(annotation) {
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    Annotator.IO.SendAnnotation(annotation, AnnotatorIO_TweetHandler);
  }

  /**
   *  Gets next or  
   *
   *  @param {function} ioCall - chosen text
   *  @return {undefined}
   */
  function GetTweet(ioCall){
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    ioCall(AnnotatorIO_TweetHandler);
  }

  function GetTweetByNumber(num){
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    Annotator.IO.GetTweet(num, AnnotatorIO_TweetHandler);
  }

  function AnnotatorIO_TweetHandler(json){
    if (json.success) {
      form.classList.remove('Neutral', 'Irrelevant', 'Opinionated');
      if (json.chosen) {
        form.classList.add(json.chosen);
      }
      SetTweet(json.tweet);
      SetNavigation(json);
      SetStatus(json);
      annotatorElm.classList.remove('loading');

      if (json.countAnnotatedTweets == json.countTweets) {
        annotatorElm.classList.add('finish');
      } 
    }
  }

  function SetTweet(tweet) {
    Rainbow.color(tweet, 'tweet', function(colored_tweet) {
      tweetContent.innerHTML = colored_tweet;
    });
  }

  /* Status ---------------------------------------------------------------- */

  function SetStatus(json){
    statusBtn.innerHTML = json.countAnnotatedTweets + '/' + json.countTweets;
  }

  /* URL Hash -------------------------------------------------------------- */

  function SetNavigation(json){
    SetUrlHash(json.currentTweetNum);
    SetTitle(json.currentTweetNum);
    SetNextPreviousButton(json.hasNext, json.hasPrevious);
  }

  function SetUrlHash (currentTweetNum){
    if (window.location.hash != '#' + currentTweetNum.toString()) {
      userSetUrlHash = false;
      window.location.hash = currentTweetNum;
    }
  }

  function SetTitle(tweetNum) {
    document.title = 'Twitter Annotator - Tweet ' + tweetNum;
  }

  function SetNextPreviousButton(hasNext, hasPrevious){
    
    if (hasNext) {
      nav.classList.add('hasNext');
      nextBtn.tabIndex = 3;
      
    } else {
      nav.classList.remove('hasNext');
      nextBtn.tabIndex = -1;
    }

    if (hasPrevious){
      nav.classList.add('hasPrevious');
      previousBtn.tabIndex = 1;
    } else {
      nav.classList.remove('hasPrevious');
      previousBtn.tabIndex = -1;
    }
  }

  function Window_HashchangeHandler(){
    if(userSetUrlHash && window.location.hash) {
      var hash = window.location.hash.substring(1);
      GetTweetByNumber(parseInt(hash, 10));
    }
    userSetUrlHash = true;
  }

  /* Interface ------------------------------------------------------------- */

  return {

    /**
     *  Initialize Script
     *  
     *  @memberof Annotator.UI
     *  @example 
     *    Annotator.UI.Run();
     *  @return {undefined}
     */
    Run: function(){
      userSetUrlHash = true;

      annotatorElm = document.querySelector('.annotator');

      nav = annotatorElm.querySelector('nav');
      form = annotatorElm.querySelector('form');
      goBtn = annotatorElm.querySelector('.goBtn');
      nextBtn = annotatorElm.querySelector('.nextBtn');
      helpBtn = annotatorElm.querySelector('.helpBtn');
      pauseBtn = annotatorElm.querySelector('.pauseBtn');
      statusBtn =  annotatorElm.querySelector('.statusBtn');
      neutralBtn = annotatorElm.querySelector('.neutralBtn');
      helpContent = annotatorElm.querySelector('.helpContent');
      previousBtn = annotatorElm.querySelector('.previousBtn');
      tweetContent = annotatorElm.querySelector('.tweetContent');
      closeHelpBtn = annotatorElm.querySelector('.closeHelpBtn');
      irrelevantBtn = annotatorElm.querySelector('.irrelevantBtn');
      opinionatedBtn = annotatorElm.querySelector('.opinionatedBtn');

      form.addEventListener('submit', Form_SubmitHandler);
      goBtn.addEventListener('click', GoBtn_ClickHandler);
      nextBtn.addEventListener('click', NextBtn_ClickHandler);
      helpBtn.addEventListener('click', HelpBtn_ClickHandler);
      pauseBtn.addEventListener('click', PauseBtn_ClickHandler);
      neutralBtn.addEventListener('click', NeutralBtn_ClickHanlder);
      previousBtn.addEventListener('click', PreviousBtn_ClickHandler);
      closeHelpBtn.addEventListener('click', HelpBtn_ClickHandler);
      irrelevantBtn.addEventListener('click', IrrelevantBtn_ClickHanlder);
      opinionatedBtn.addEventListener('click', OpinionatedBtn_ClickHanlder);

      document.addEventListener('keydown', Document_KeyDownHandler);
      document.addEventListener('keyup', Document_KeyUpHandler);

      window.addEventListener('hashchange', Window_HashchangeHandler);

      Window_HashchangeHandler();
    }
  };

}());
