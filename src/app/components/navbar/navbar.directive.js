(function() {
  'use strict';

  angular
    .module('meetingApp')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($scope, moment, $mdDialog, $mdMedia) {
      var vm = this;

      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();

      vm.showAboutDialog = function(ev) {
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title('About tiktokk')
              .textContent('Closing to offscreen')
              .ariaLabel('Offscreen Demo')
              .ok('Close')
              .targetEvent(ev)
        );
      };

      vm.showConfirm = function(ev) {
        $mdDialog.show({
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          targetEvent: ev,
          template:
            '<md-dialog aria-label="About" ng-cloak>' +
            '  <form>'+
            '    <md-toolbar>'+
            '      <div class="md-toolbar-tools">'+
            '       <h2>About</h2>' +
            '       <span flex></span>'+
            '    	  <md-button class="md-icon-button" ng-click="closeDialog()">'+
            '  	      <md-icon aria-label="Close dialog">x</md-icon>' +
            '  	    </md-button>' +
            '    	 </div>' +
            '    </md-toolbar>' +
            '    <md-dialog-content>' +
            '  	    <div class="md-dialog-content">' +
            '	        <img style="margin: auto; max-width: 100%;" alt="tiktokk logo" src="assets/images/logo-1-2048.png">' +
            '    	    <h2>About</h2>' +
            '  	    	<p>Whether its a meeting, a workout routine, or anything in-between, with tiktokk you can stay on time by planning and tracking your tasks.</p>' +
            '	        <p>tiktokk is a simple web application where you can create, organise, and track tasks easily. Specify task topics and durations, arrange them in order, then as the timer runs you can see (and soon hear) the state of your schedule.</p>' +
            '    	    <p>We are a new platform that will continue to grow and imporve. We plan to allow users to create accounts and save multiple schedules soon. For now your schedule state will be saved in your browser. User feedback is always welcome' +
            '  	    	  <a href="https://twitter.com/tiktokkapp" target="_blank">@tiktokkapp</a>' +
            '  	    	</p>' +
            '    	  </div>' +
            '    </md-dialog-content>' +
            '  </form>' +
            '</md-dialog>',
          controller: DialogController
        });
      };

      vm.showPrerenderedDialog = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        });
        
      };

      function DialogController($scope, $mdDialog) {
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }

    }
  }

})();
