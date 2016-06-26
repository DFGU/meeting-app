(function() {
  'use strict';


  angular
    .module('meetingApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1466910715526;
    

    var todoList = this;
    todoList.todos = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];
 
    todoList.addTodo = function() {
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };
 
    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    todoList.archive = function() {
      var oldTodos = todoList.todos;
      todoList.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.todos.push(todo);
      });
    };
    

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }



  angular
    .module('meetingApp')
    .controller('TimeController', ['$scope', '$element', function($scope, $element) {
      $scope.seconds = 0;
      $scope.minutes = 0;
      $scope.hours = 0;

      if ($element.html().trim().length === 0) {
          $element.append($compile('<span>{{millis}}</span>')($scope));
      }

      $scope.startTime = null;
      $scope.timeoutId = null;
      $scope.countdown = $scope.countdownattr && parseInt($scope.countdownattr, 10) > 0 ? parseInt($scope.countdownattr, 10) : undefined;
      $scope.isRunning = false;

      $scope.$on('timer-start', function () {
          $scope.start();
      });

      $scope.$on('timer-resume', function () {
          $scope.resume();
      });

      $scope.$on('timer-stop', function () {
          $scope.stop();
      });

      function resetTimeout() {
          if ($scope.timeoutId) {
              clearTimeout($scope.timeoutId);
          }
      }

      $scope.start = $element[0].start = function () {
          $scope.startTime = $scope.startTimeAttr ? new Date($scope.startTimeAttr) : new Date();
          resetTimeout();
          tick();
      };

      $scope.resume = $element[0].resume = function () {
          resetTimeout();
          $scope.startTime = new Date() - ($scope.stoppedTime - $scope.startTime);
          tick();
      };

      $scope.stop = $element[0].stop = function () {
          $scope.stoppedTime = new Date();
          resetTimeout();
          $scope.timeoutId = null;
      };

      $element.bind('$destroy', function () {
          resetTimeout();
      });



      //-- Timer Start stop button functions
      $scope.timerRunning = false;

      $scope.startTimer = function (){
          $scope.$broadcast('timer-start');
          $scope.timerRunning = true;
      };

      $scope.stopTimer = function (){
          $scope.$broadcast('timer-stop');
          $scope.timerRunning = false;
      };

      $scope.$on('timer-stopped', function (event, data){
          console.log('Timer Stopped - data = ', data);
      });



      var tick = function () {
          if ($scope.countdown > 0) {
              $scope.countdown--;
          }
          else if ($scope.countdown <= 0) {
              $scope.stop();
          }

          $scope.millis = new Date() - $scope.startTime;

          if ($scope.countdown > 0) {
              $scope.millis = $scope.countdown * 1000
          }

          $scope.seconds = Math.floor(($scope.millis / 1000) % 60);
          $scope.minutes = Math.floor((($scope.millis / (1000 * 60)) % 60));
          $scope.hours = Math.floor((($scope.millis / (1000 * 60 * 60)) % 24));
          $scope.days = Math.floor((($scope.millis / (1000 * 60 * 60)) / 24));
          //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
          $scope.timeoutId = setTimeout(function () {
              tick();
              $scope.$apply();
          }, $scope.interval);

          $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
      };

    }])
    .directive('timer', function ($timeout, $compile) {
      return {
        restrict: 'E',
        replace: false,
        scope: {
            interval: '=interval',
            startTimeAttr: '=startTime',
            countdownattr: '=countdown'
        }
      };
    });


})();
