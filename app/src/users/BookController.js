(function(){

  angular
       .module('users')
       .controller('UserController', [
          'catService', '$mdSidenav', '$mdBottomSheet', '$log', '$q','$mdDialog','$scope','$http','$window',
          UserController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */

    function UserController( catService, $mdSidenav, $mdBottomSheet, $log, $q,$mdDialog,$scope,$http,$window) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.books        = [ ];
    self.selectUser   = selectUser;
    self.selectBook   = selectBook;
    self.toggleList   = toggleUsersList;
    self.showContactOptions  = showContactOptions;
    self.deletebook   = deletebook;
    self.streams      = streams();
    self.showAdd      = showAdd;
    self.upvote       = upvote;
    self.downvote     = downvote;

  var strVar="";
  strVar += "<md-dialog aria-label=\"book Form\">";
  strVar += "    <md-content class=\"md-padding\">";
  strVar += "";
  strVar += "        <form name=\"bookForm\">";
  strVar += "            <h1>Add a Book<\/h1>";
  strVar += "            <div layout layout-sm=\"column\">";
  strVar += "                <md-input-container flex><label>Book Title<\/label> <input ng-model=\"book.title\"";
  strVar += "                                                                          placeholder=\"Title of Book\">";
  strVar += "                <\/md-input-container>";
  strVar += "            <\/div>";
  strVar += "            <md-input-container flex><label>Author<\/label> <input ng-model=\"book.author\"><\/md-input-container>";
  strVar += "            <div layout layout-sm=\"column\">";
  strVar += "                <md-input-container flex><label>Number of pages<\/label> <input ng-model=\"book.pagenum\"><\/md-input-container>";
  strVar += "                <md-input-container flex><label>Reading time (hours/num)<\/label> <input ng-model=\"book.readtime\"><\/md-input-container>";
  strVar += "            <\/div>";
  strVar += "            <md-input-container flex><label>Link<\/label> <textarea ng-model=\"book.link\" columns=\"1\"";
  strVar += "                                                                       ><\/textarea>";
  strVar += "            <\/md-input-container>";
  strVar += "                <md-input-container flex><label>Brief Description <\/label> <textarea ng-model=\"book.brfdescrip\" columns=\"1\"><\/textarea>";
  strVar += "";
  strVar += "                <\/md-input-container>";
  strVar += "                <md-input-container flex><label>Image Text <\/label> <textarea ng-model=\"book.image\"><\/textarea>";
  strVar += "";
  strVar += "                <\/md-input-container>";
  strVar += "                <md-input-container flex><label>Phase number<\/label> <textarea ng-model=\"book.phase\" ><\/textarea>";
  strVar += "";
  strVar += "                <\/md-input-container>";
  strVar += "        <\/form>";
  strVar += "    <\/md-content>";
  strVar += "    <md-dialog-actions layout=\"row\"><span flex><\/span>";
  strVar += "        <md-button ng-click=\"cancel(\'not useful\')\"> Cancel<\/md-button>";
  strVar += "        <md-button ng-click=\"answer(\'useful\')\" class=\"md-primary\"> Save<\/md-button>";
  strVar += "    <\/md-dialog-actions>";
  strVar += "<\/md-dialog>";

      $scope.$watch(function(){
          return window.innerWidth;
      }, function(value) {
          if (value > 768) {$scope.watchwidth = true;} else {$scope.watchwidth = false;}

      });

      $scope.redirectToAmazon = function redirectToAmazon(link) {
          $window.open(link, '_blank');
          //console.log(link);
      };

      $scope.isLoggedIn = isLoggedIn;
      function isLoggedIn(req, res, next) {

          // if user is authenticated in the session, carry on
          if (req.isAuthenticated())
              return next();

          // if they aren't redirect them to the home page
          res.redirect('/');
          //console.log("Bruh you're not logged in!");
      }

      function upvote(id) {
         // console.log('Upvoted :  ' + id);
          $http.post('/api/books/upvote'+id).then(function (res) {
              //console.log('Upvoted :  ' + id + res);
              refresh();
          });
      }

      function downvote(id) {
          //console.log('Downvoted :  ' + id);
          $http.post('/api/books/downvote'+id).then(function (res) {
              //console.log('Downvoted :  ' + id + " " + res.data);
              refresh();
          });
      }

      function showAdd (ev) {
          $mdDialog.show({
              controller: DialogController,
              template: strVar,
              targetEvent: ev,
          })
              .then(function(answer) {
                  $scope.alert = 'You said the information was "' + answer + '".';
              }, function() {
                  $scope.alert = 'You cancelled the dialog.';
              });
          //console.log('Button clicked');
      }

      function  streams() {

        var streams =[{title: "Home", href:"home"},
        {title: "Startups", href:"startups"},
        //{title: "Startups"},
        //{title:"Leadership"},
        //{title:"Healthcare"},
        //{title:"Energy"},
        //{title:"Parenting"},
        {title:"Contact", href:"contact"}];
        return streams;

      }

      function selectBook(book) {
          self.selected = book;

      }
      function deletebook(id) {
          $http.delete('/api/books/'+id).then(function () {
              //console.log('Deleted :  ' + id);
              refresh();
          });
      }

      function DialogController($scope, $mdDialog,$http) {
          $scope.hide = function() {
              $mdDialog.hide();
          };

          $scope.cancel = function() {
              refresh();
              $mdDialog.cancel();

          };

          $scope.answer = function(answer) {
              var bkinfo = {
                  title: angular.isDefined($scope.book.title) ? $scope.book.title : "",
                  author: angular.isDefined($scope.book.author) ? $scope.book.author : "",
                  pages: angular.isDefined($scope.book.pagenum) ? $scope.book.pages: "",
                  readtime: angular.isDefined($scope.book.readtime) ? $scope.book.readtime : "",
                  brfdescrip: angular.isDefined($scope.book.brfdescrip) ? $scope.book.brfdescrip : "",
                  link: angular.isDefined($scope.book.link) ? $scope.book.link : "",
                  image: angular.isDefined($scope.book.image) ? $scope.book.image : "",
                  phase: angular.isDefined($scope.book.phase) ? $scope.book.phase : ""
              };
              $http.post('/api/books', bkinfo);

              refresh();

              $mdDialog.hide(answer);
          };
      }

    // Load all registered books/users

    catService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
            refresh();
          });

    function refresh() {
        $http.get('/api/books').then(function(books) {
            self.books = books.data;
        });
    }
    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var user = self.selected;

        return $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: './src/users/view/contactSheet.html',
          controller: [ '$mdBottomSheet', ContactPanelController],
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function ContactPanelController( $mdBottomSheet ) {
          this.user = user;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.submitContact = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

  }

})();
