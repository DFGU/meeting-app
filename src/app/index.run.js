(function() {
  'use strict';

  angular
    .module('meetingApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
