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
          templateUrl: 'aboutDialog.html',
          locals: {
            items: $scope.items
          },
          controller: DialogController
        });
        function DialogController($scope, $mdDialog, items) {
          $scope.items = items;
          $scope.closeDialog = function() {
            $mdDialog.hide();
          }
        }
      };
    }
  }

})();
