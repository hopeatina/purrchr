/**
 * Created by hnatina on 11/8/15.
 */
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'jRIjxtRXA8QU7YF73DchyLVaI',
        'consumerSecret'    : 'tJ96n7N7v2QjG2fJ4VvTsPRE6U0F2DrOLLjhxLDEKoF6APTRQu',
        'callbackURL'       : 'https://breadth.me/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};