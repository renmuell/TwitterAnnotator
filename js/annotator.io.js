/**
 *  Contains all server calls
 *
 *  TODO: Replace Fake offline Methods with ajax calls.
 */
var Annotator = {} || Annotator;

Annotator.IO = (function() {
	'use strict';

	var
	currentTweetNum = 0,
	fakeSuccessStatus = true,
	fakeServerTimeOffset = 1500,
	fakeTweets = [
		{
			tweet: 'Allen Ruiz by Yulia Gorbachenko >> www.inspirefirst.com/2015/05/29/all... Please RT #art #photography ',
			chosen: ''
		},
		{
			tweet:'Revisiting one book proposal and beginning a beginning of a draft of another. Inspired by folks lately',
			chosen: ''
		},
		{
			tweet:'gg @fragdolls',
			chosen: ''
		},
		{
			tweet:'ICYMI, #IndieCade15 submissions end in just a few days! Send in your indie game by June 1st: indiecade.com/submissions/',
			chosen: ''
		},
		{
			tweet:'Maison L by Loïc Picquet Architecte >> homeadore.com/2013/10/02/mai... Please RT #architecture #interiordesign',
			chosen: ''
		},
		{
			tweet:'Le 4 Screens, weils grad im Stream gefragt wurde. Foto ist doof und alt, aber man kanns ein bisschen erkennen :) ',
			chosen: ''
		},
		{
			tweet:'If you\'re in the UK & have old games/consoles you\'re willing to spare, do a good thing and donate them to hospitals for kids through @GWGUK',
			chosen: ''
		},
		{
			tweet:'Thanks to @playouya  people in #india enjoy high quality affordable games at home on TV. Such as @sonic_hedgehog ',
			chosen: ''
		},
		{
			tweet:'New website, new letters column! www.johnnywander.com byeeeee',
			chosen: ''
		},
		{
			tweet:'jersey: Karl, the man with no past; there are no more roads left to build; and the Bat Detector has found a 13th bat! #youhadtobethere',
			chosen: ''
		},
		{
			tweet:'Update! www.monsterkind.enenkay.com/comic/221',
			chosen: ''
		},
		{
			tweet: '@EnEnKay Um, read my comic imo',
			chosen: ''
		},
		{
			tweet: 'Aviator Apartment by mode:lina architekci >> homeadore.com/2013/11/27/avi... Please RT #architecture #interiordesign ',
			chosen: ''
		},
		{
			tweet: 'Who\'s coming to my 6:30pm panel at MomoCon? I have some announcements! If you aren\'t here, make sure you stay tuned to the site!',
			chosen: ''
		},
		{
			tweet: 'New: Hola VPN client vulnerabilities put millions of users at risk - www.bit.ly/1eEjm9B #0day',
			chosen: ''
		},
		{
			tweet: 'Get the top 5 Linux stories from the past week on http://Linux.com  (incl. updates on the 1st Android auto car!) www.bit.ly/1HX3oB3',
			chosen: ''
		},
		{
			tweet: 'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
			chosen: ''
		}
	];

	/* Interface ------------------------------------------------------------- */

	return {
		SendAnnotation: function(annotation, callback){
			FakeSendAnnotation(annotation, callback);
		},
		NextTweet: function(callback){
			FakeNextTweet(callback);
		},
		PreviousTweet: function(callback){
			FakePreviousTweet(callback);
		},
		Pause: function (callback) {
			FakePause(callback);
		},
		Resume: function(callback) {
			FakeResume(callback);
		},
		GetTweet: function(num, callback){
			FakeGetTweet(num, callback);
		}
	};

	/* Fake Method ----------------------------------------------------------- */

	function FakeSendAnnotation (annotation, callback) {
		fakeTweets[currentTweetNum].chosen = annotation;
		FakeNextTweet(callback);
	}

	function FakeNextTweet (callback) {
		if(currentTweetNum != fakeTweets.length - 1) {
			currentTweetNum++;
		}
		FakeSendTweet(callback);
	}

	function FakePreviousTweet(callback){
		if(currentTweetNum != 0) {
			currentTweetNum--;
		}
		FakeSendTweet(callback);
	}

	function FakePause(callback) {
		setTimeout(function(){
			callback({
				success: fakeSuccessStatus
			});
		}, fakeServerTimeOffset);
	}

	function FakeResume(callback) {
		FakeSendTweet(callback);
	}

	function FakeGetTweet(num, callback){
		num--;

		if(num < 0) {
			num = 0;
		}
		else if (num > fakeTweets.length - 1) {
			num = fakeTweets.length - 1;
		}

		currentTweetNum = num;

		FakeSendTweet(callback);
	}

	function FakeSendTweet(callback) {
		setTimeout(function () {
		  callback({
			success: fakeSuccessStatus,
			tweet: fakeTweets[currentTweetNum].tweet,
			chosen: fakeTweets[currentTweetNum].chosen,
			existNext: currentTweetNum < fakeTweets.length -1,
			existPrevious:  currentTweetNum > 0,
			currentTweetNum: currentTweetNum + 1
		  });
		}, fakeServerTimeOffset);
	}

}());