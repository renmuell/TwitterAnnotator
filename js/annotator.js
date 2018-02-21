/******************************************************************************
 * annotator.js
 *
 * Contains all functions for the annotator
 *
 *****************************************************************************/

(function(){
  'use strict';

  var
  annotatorElm,
  userSetUrlHash,

  nav,
  form,
  goBtn,
  nextBtn,
  helpBtn,
  pauseBtn,
  statusBtn,
  neutralBtn,
  helpContent,
  previousBtn,
  tweetContent,
  closeHelpBtn,
  irrelevantBtn,
  opinionatedBtn,

  KeyCodes = {
    q:81,
    e:69,
    w:87,
    a:65,
    s:83,
    c:67,
    d:68
  };

  /* Interface ------------------------------------------------------------- */

  return {
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

      form.addEventListener("submit", Form_SubmitHandler);
      goBtn.addEventListener("click", GoBtn_ClickHandler);
      nextBtn.addEventListener("click", NextBtn_ClickHandler);
      helpBtn.addEventListener("click", HelpBtn_ClickHandler);
      pauseBtn.addEventListener("click", PauseBtn_ClickHandler);
      neutralBtn.addEventListener("click", NeutralBtn_ClickHanlder);
      previousBtn.addEventListener("click", PreviousBtn_ClickHandler);
      closeHelpBtn.addEventListener("click", HelpBtn_ClickHandler);
      irrelevantBtn.addEventListener("click", IrrelevantBtn_ClickHanlder);
      opinionatedBtn.addEventListener("click", OpinionatedBtn_ClickHanlder);

      document.addEventListener('keydown', Document_KeyDownHandler);
      document.addEventListener('keyup', Document_KeyUpHandler);

      window.addEventListener("hashchange", Window_HashchangeHandler);

      Window_HashchangeHandler();
    }
  };

  /* Action Handler -------------------------------------------------------- */

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

  function PauseBtn_ClickHandler(event){
    pauseBtn.blur();
    SendPause();
  }

  function GoBtn_ClickHandler(event){
    goBtn.blur();
    SendResume();
  }

  function PreviousBtn_ClickHandler(event){
    previousBtn.blur();
    GetTweet(Annotator.IO.PreviousTweet);
  }

  function NextBtn_ClickHandler(event){
    nextBtn.blur();
    GetTweet(Annotator.IO.NextTweet);
  }

  function HelpBtn_ClickHandler(event){
    helpBtn.blur();
    if (!helpBtn.classList.contains('open')) {
      ToggleHelp();
    }
  }

  function Form_SubmitHandler(event) {
    event.preventDefault();
  }

  function NeutralBtn_ClickHanlder(event) {
    neutralBtn.blur();
    SendAnnotation('Neutral');
  }

  function IrrelevantBtn_ClickHanlder(event) {
    irrelevantBtn.blur();
    SendAnnotation('Irrelevant');
  }

  function OpinionatedBtn_ClickHanlder(event) {
    opinionatedBtn.blur();
    SendAnnotation('Opinionated');
  }

  function ShowButtonPress(elm){
    elm.classList.toggle('active');
  }

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
    ].forEach(b => b.classList.remove('active'))
  }

  /* HELP ------------------------------------------------------------------ */

  function ToggleHelp(){
    helpContent.classList.toggle('open');
  }

  /* IO -------------------------------------------------------------------- */

  function SendPause() {
    SetTweet('');
    annotatorElm.classList.add('loading');
    Annotator.IO.Pause(function (json) {
      if (json.success) {
        goBtn.querySelector('span').innerHTML = "Continue"; 
        annotatorElm.classList.remove('loading');
        annotatorElm.classList.add('pause');
      } else {

      }
    });
  }

  function SendResume(){
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    Annotator.IO.Resume(AnnotatorIO_TweetHandler);
  }

  function SendAnnotation(annotation) {
    annotatorElm.classList.remove('pause');
    annotatorElm.classList.add('loading');
    Annotator.IO.SendAnnotation(annotation, AnnotatorIO_TweetHandler);
  }

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
      
    } else {

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

}()).Run();
