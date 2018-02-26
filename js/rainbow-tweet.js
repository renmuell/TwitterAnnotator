/******************************************************************************
 * rainbow-tweet.js
 *
 * Contains an extension language for rainbow.js, the Tweet Syntax.
 *
 *****************************************************************************/

Rainbow.extend('tweet', [{
    'name': 'tweet-user',
    'pattern': /@[^\s]*/g
}, {
    'name': 'tweet-hashtag',
    'pattern': /#[^\s]*/g
}, {
    'name': 'tweet-url',
    'pattern': /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g
}, {
    'name': 'tweet-retweeting',
    'pattern': /RT/g
}, {
    'name': 'tweet-mention-reply',
    'pattern': /MT/g
}, {
    'name': 'tweet-overheard',
    'pattern': /OH/g
}, {
    'name': 'tweet-signatures',
    'pattern': /\^[^\s]*/g
}, {
    'name': 'tweet-ticker',
    'pattern': /\$[^\s]*/g
}], true);
