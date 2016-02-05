(function() {
  'use strict';

  angular
    .module('gitHub')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
