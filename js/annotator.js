/**
 *  Contains all functions for the annotator
 */
(function(){
  'use strict';

  var
  annotatorElm,
  userSetUrlHash,

  nav,
  form,
  goBtn,
  nextBtn,
  pauseBtn,
  neutralBtn,
  previousBtn,
  irrelevantBtn,
  opinionatedBtn,

  KeyCodes = {
    q:81,
    e:69,
    a:65,
    s:83,
    d:68,
    space:32
  };

  /* Interface ------------------------------------------------------------- */

  return {
    Run: function(){
      userSetUrlHash = true;

      annotatorElm = document.querySelector('#annotator');

      nav = annotatorElm.querySelector('nav');
      form = annotatorElm.querySelector('form');
      goBtn = annotatorElm.querySelector('#goBtn');
      nextBtn = annotatorElm.querySelector('#nextBtn');
      pauseBtn = annotatorElm.querySelector('#pauseBtn');
      neutralBtn = annotatorElm.querySelector('#neutralBtn');
      previousBtn = annotatorElm.querySelector('#previousBtn');
      irrelevantBtn = annotatorElm.querySelector('#irrelevantBtn');
      opinionatedBtn = annotatorElm.querySelector('#opinionatedBtn');

      form.addEventListener("submit", Form_SubmitHandler);
      goBtn.addEventListener("click", GoBtn_ClickHandler);
      nextBtn.addEventListener("click", NextBtn_ClickHandler);
      pauseBtn.addEventListener("click", PauseBtn_ClickHandler);
      neutralBtn.addEventListener("click", NeutralBtn_ClickHanlder);
      previousBtn.addEventListener("click", PreviousBtn_ClickHandler);
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
    if (annotatorElm.className == '') {
      switch(event.keyCode){
        case KeyCodes.q    : ShowButtonPress(previousBtn);    break;
        case KeyCodes.e    : ShowButtonPress(nextBtn);        break;
        case KeyCodes.a    : ShowButtonPress(irrelevantBtn);  break;
        case KeyCodes.s    : ShowButtonPress(neutralBtn);     break;
        case KeyCodes.d    : ShowButtonPress(opinionatedBtn); break;
        case KeyCodes.space: ShowButtonPress(pauseBtn);
      }
    } else if (annotatorElm.className == 'pause'
            && event.keyCode == KeyCodes.space){
        ShowButtonPress(goBtn);
    }
  }

  function Document_KeyUpHandler(event){
    ShowButtonPressReset();
    if (annotatorElm.className == '') {
      switch(event.keyCode){
        case KeyCodes.q    : GetTweet(Annotator.IO.PreviousTweet); break;
        case KeyCodes.e    : GetTweet(Annotator.IO.NextTweet);     break;
        case KeyCodes.a    : SendAnnotation('Irrelevant');         break;
        case KeyCodes.s    : SendAnnotation('Neutral');            break;
        case KeyCodes.d    : SendAnnotation('Opinionated');        break;
        case KeyCodes.space: SendPause();
      }
    } else if (annotatorElm.className == 'pause'
            && event.keyCode == KeyCodes.space){
      SendResume();
    }
  }

  function PauseBtn_ClickHandler(event){
    event.preventDefault();
    SendPause();
  }

  function GoBtn_ClickHandler(event){
    event.preventDefault();
    SendResume();
  }

  function PreviousBtn_ClickHandler(event){
    event.preventDefault();
    GetTweet(Annotator.IO.PreviousTweet);
  }

  function NextBtn_ClickHandler(event){
    event.preventDefault();
    GetTweet(Annotator.IO.NextTweet);
  }

  function Form_SubmitHandler(event) {
    event.preventDefault();
  }

  function NeutralBtn_ClickHanlder(event) {
    SendAnnotation('Neutral');
  }

  function IrrelevantBtn_ClickHanlder(event) {
    SendAnnotation('Irrelevant');
  }

  function OpinionatedBtn_ClickHanlder(event) {
    SendAnnotation('Opinionated');
  }

  function ShowButtonPress(elm){
    elm.className = 'active';
  }

  function ShowButtonPressReset(){
    goBtn.className = '';
    nextBtn.className = '';
    pauseBtn.className = '';
    neutralBtn.className = '';
    previousBtn.className = '';
    irrelevantBtn.className = '';
    opinionatedBtn.className = '';
  }

  /* IO -------------------------------------------------------------------- */

  function SendPause() {
    SetTweet('');
    annotatorElm.className = 'loading';
    Annotator.IO.Pause(function (json) {
      if (json.success) {
        annotatorElm.className = 'pause';
      } else {

      }
    });
  }

  function SendResume(){
    annotatorElm.className = 'loading';
    Annotator.IO.Resume(AnnotatorIO_TweetHandler);
  }

  function SendAnnotation(annotation) {
    annotatorElm.className = 'loading';
    Annotator.IO.SendAnnotation(annotation, AnnotatorIO_TweetHandler);
  }

  function GetTweet(ioCall){
    annotatorElm.className = 'loading';
    ioCall(AnnotatorIO_TweetHandler);
  }

  function GetTweetByNumber(num){
    annotatorElm.className = 'loading';
    Annotator.IO.GetTweet(num, AnnotatorIO_TweetHandler);
  }

  function AnnotatorIO_TweetHandler(json){
      if (json.success) {
        form.className = json.chosen;
        SetTweet(json.tweet);
        SetNavigation(json);
        annotatorElm.className = '';
      } else {

      }
  }

  function SetTweet(tweet) {
    Rainbow.color(tweet, 'tweet', function(colored_tweet) {
      var tweetElm = document.getElementById('tweet');
      tweetElm.innerHTML = colored_tweet;
    });
  }

  /* URL Hash -------------------------------------------------------------- */

  function SetNavigation(json){
    SetUrlHash(json.currentTweetNum);
    SetTitle(json.currentTweetNum);
    SetNextPreviousButton(json.existNext, json.existPrevious);
  }

  function SetUrlHash (currentTweetNum){
    if (window.location.hash != '#' + currentTweetNum.toString()) {
      userSetUrlHash = false;
      window.location.hash = currentTweetNum;
    }
  }

  function SetTitle(tweetNum) {
    document.title = 'Annotator - Tweet ' + tweetNum;
  }

  function SetNextPreviousButton(existNext, existPrevious){
    nav.className = '';
    if (existNext) {
      nav.className += 'existNext';
    }
    if (existPrevious){
      nav.className += ' existPrevious';
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
