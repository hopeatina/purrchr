/**
 * Created by hnatina on 11/6/15.
 */
(function(){
    'use strict';

    angular.module('books')
        .service('bookService', ['$q', BookService]);

    function BookService($q) {

    }

})();