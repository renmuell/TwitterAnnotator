var Annotator=Annotator||{}
Annotator.UI=function(){"use strict"
function e(e){if(e.keyCode===F.w)d(C)
else if(A.classList.contains("pause"))A.classList.contains("pause")&&e.keyCode==F.c&&d(B)
else switch(e.keyCode){case F.q:d(D)
break
case F.e:d(N)
break
case F.a:d(j)
break
case F.s:d(M)
break
case F.d:d(z)
break
case F.c:d(P)}}function t(e){if(L(),e.keyCode===F.w)f()
else if(A.classList.contains("pause")||R.classList.contains("open"))A.classList.contains("pause")&&e.keyCode==F.c&&w()
else switch(e.keyCode){case F.q:b(Annotator.IO.PreviousTweet)
break
case F.e:b(Annotator.IO.NextTweet)
break
case F.a:k("Irrelevant")
break
case F.s:k("Neutral")
break
case F.d:k("Opinionated")
break
case F.c:v()}}function n(){P.blur(),v()}function s(){B.blur(),w()}function a(){D.blur(),b(Annotator.IO.PreviousTweet)}function o(){N.blur(),b(Annotator.IO.NextTweet)}function c(){C.blur(),C.classList.contains("open")||f()}function i(e){e.preventDefault()}function r(){M.blur(),k("Neutral")}function u(){j.blur(),k("Irrelevant")}function l(){z.blur(),k("Opinionated")}function d(e){e.classList.toggle("active")}function L(){[B,N,C,P,M,D,j,z].forEach(function(e){e.classList.remove("active")})}function f(){R.classList.toggle("open")}function v(){y(""),A.classList.add("loading"),Annotator.IO.Pause(function(e){e.success&&(B.querySelector("span").innerHTML="Continue",A.classList.remove("loading"),A.classList.add("pause"))})}function w(){A.classList.remove("pause"),A.classList.add("loading"),Annotator.IO.Resume(p)}function k(e){A.classList.remove("pause"),A.classList.add("loading"),Annotator.IO.SendAnnotation(e,p)}function b(e){A.classList.remove("pause"),A.classList.add("loading"),e(p)}function h(e){A.classList.remove("pause"),A.classList.add("loading"),Annotator.IO.GetTweet(e,p)}function p(e){e.success&&(x.classList.remove("Neutral","Irrelevant","Opinionated"),e.chosen&&x.classList.add(e.chosen),y(e.tweet),q(e),m(e),A.classList.remove("loading"),e.countAnnotatedTweets==e.countTweets&&A.classList.add("finish"))}function y(e){Rainbow.color(e,"tweet",function(e){G.innerHTML=e})}function m(e){H.innerHTML=e.countAnnotatedTweets+"/"+e.countTweets}function q(e){S(e.currentTweetNum),I(e.currentTweetNum),T(e.hasNext,e.hasPrevious)}function S(e){window.location.hash!="#"+e.toString()&&(E=!1,window.location.hash=e)}function I(e){document.title="Twitter Annotator - Tweet "+e}function T(e,t){e?(O.classList.add("hasNext"),N.tabIndex=3):(O.classList.remove("hasNext"),N.tabIndex=-1),t?(O.classList.add("hasPrevious"),D.tabIndex=1):(O.classList.remove("hasPrevious"),D.tabIndex=-1)}function g(){if(E&&window.location.hash){var e=window.location.hash.substring(1)
h(parseInt(e,10))}E=!0}var A,E,O,x,B,N,C,P,H,M,R,D,G,U,j,z,F={q:81,e:69,w:87,a:65,s:83,c:67,d:68}
return{Run:function(){E=!0,A=document.querySelector(".annotator"),O=A.querySelector("nav"),x=A.querySelector("form"),B=A.querySelector(".goBtn"),N=A.querySelector(".nextBtn"),C=A.querySelector(".helpBtn"),P=A.querySelector(".pauseBtn"),H=A.querySelector(".statusBtn"),M=A.querySelector(".neutralBtn"),R=A.querySelector(".helpContent"),D=A.querySelector(".previousBtn"),G=A.querySelector(".tweetContent"),U=A.querySelector(".closeHelpBtn"),j=A.querySelector(".irrelevantBtn"),z=A.querySelector(".opinionatedBtn"),x.addEventListener("submit",i),B.addEventListener("click",s),N.addEventListener("click",o),C.addEventListener("click",c),P.addEventListener("click",n),M.addEventListener("click",r),D.addEventListener("click",a),U.addEventListener("click",c),j.addEventListener("click",u),z.addEventListener("click",l),document.addEventListener("keydown",e),document.addEventListener("keyup",t),window.addEventListener("hashchange",g),g()}}}()
