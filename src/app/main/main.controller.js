(function() {
  'use strict';

  angular
    .module('meetingApp')
    .service("todoService", function ($cookies){
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;


      this.todos = $cookies.getObject('topicList');

      if (this.todos == null){
        this.todos = [
          {text:'Example topic 1', duration:1, done:true, time:1 ,rowClass:''},
          {text:'Example topic 2', duration:2, done:false, time:3, rowClass:''},
          {text:'Example topic 3', duration:5, done:false, time:8, rowClass:''}];
      }
    

      this.updateTodosTime = function() {
        var time = 0;
        angular.forEach(this.todos, function(todo) {
          time += todo.duration;
          todo.time = time;
        });
        $cookies.putObject('topicList', this.todos);
      };

      this.resetList = function() {
        this.todos = [{text:'Example topic', duration:2, done:false, time:1 ,rowClass:''}];
        $cookies.putObject('topicList', this.todos);
      };

      this.getTodos = function() {
        return this.todos;
      };

      this.getSeconds = function() {
        return this.seconds;
      };

      this.getMinutes = function() {
        return this.minutes;
      };

      this.getHours = function() {
        return this.hours;
      };

      this.addTopic = function(topicText, topicTime) {
        var time = 0;

        if (this.todos.length == 1 && this.todos[0].text == "Example topic"){
          this.todos[0].text = topicText;
          this.todos[0].duration = topicTime;
          this.todos[0].time = topicTime;
          $cookies.putObject('topicList', this.todos);
          return;
        }

        angular.forEach(this.todos, function(todo, key) {
          time += todo.duration;
        });
        time += topicTime;
        
        this.todos.push({text:topicText, duration:topicTime, done:false, time:time});

        $cookies.putObject('topicList', this.todos);
      };
      
    });


  angular
    .module('meetingApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, webDevTec, todoService) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1466910715526;    
    vm.todoTime = 5;

    vm.todos = todoService.getTodos();

    vm.addTodo = function () {
      todoService.addTopic(vm.todoText, vm.todoTime);

      vm.todoText = '';
      vm.todoTime = 5;
    }
  }



  angular
    .module('meetingApp')
    .controller('TimeController', TimeController)
    .directive('timer', function () {
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

    function TimeController ($scope, $element, todoService) {

      $scope.seconds = todoService.getSeconds();
      $scope.minutes = todoService.getMinutes();
      $scope.hours = todoService.getHours();

      $scope.buttonText = 'Start';

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

      $scope.$on('timer-reset', function () {
          $scope.reset();
          
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

      $scope.reset = $element[0].reset = function () {
        if($scope.timerRunning == true){
          $scope.startTime = new Date();
          $scope.timeoutId = null;
        }
        else {
          $scope.startTime = new Date();
          $scope.stoppedTime = new Date();
          resetTimeout();
          $scope.timeoutId = null;

          $scope.seconds = 0;
          $scope.minutes = 0;
          $scope.hours = 0;
        }
      };

      $element.bind('$destroy', function () {
          resetTimeout();
      });



      //-- Timer start/stop button functions
      $scope.timerRunning = false;
      $scope.timerInit = false;

      $scope.startTimer = function (){
          if ($scope.timerRunning == true){
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
            $scope.buttonText = 'Resume';
          }
          else if ($scope.timerInit == false){
            $scope.$broadcast('timer-start');
            $scope.timerInit = true;
            $scope.timerRunning = true;
            $scope.buttonText = 'Pause';
          }
          else{
            $scope.$broadcast('timer-resume');
            $scope.timerRunning = true;
            $scope.buttonText = 'Pause';
          }
      };

      $scope.resetTimer = function (){
          $scope.$broadcast('timer-reset');
          if ($scope.timerRunning == false)
            $scope.buttonText = 'Start';
          checkTopicTime();
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


          checkTopicTime();

          //We are not using $timeout for a reason. Please read here - https://github.com/siddii/angular-timer/pull/5
          $scope.timeoutId = setTimeout(function () {
              tick();
              $scope.$apply();
          }, $scope.interval);

          $scope.$emit('timer-tick', {timeoutId: $scope.timeoutId, millis: $scope.millis});
      };

      var checkTopicTime = function () {
        var t = todoService.getTodos();
        angular.forEach(t, function(todo) {
          // complete
          if ($scope.minutes >= todo.time) {
            todo.done = true;
            todo.rowClass = 'success';
          }
          // half time
          // else if ($scope.minutes >= todo.time - (todo.duration / 2)) {
          //   todo.rowClass = 'warning';
          // }
          // minute warning
          else if ($scope.minutes == todo.time - 1) {
            todo.rowClass = 'warning';
          }
          // running 
          else if ($scope.minutes >= todo.time - todo.duration) {
            todo.rowClass = 'info';
          }
          else {
            todo.rowClass = '';
          }
          
          
        });
      };

    }
    


    angular.module("meetingApp")
      .controller("TableController", function($scope, todoService) {

        $scope.list = todoService.getTodos();

        $scope.models = {
            selected: null
        };

        $scope.treeOptions = {
          dropped: function() {
            todoService.updateTodosTime();
          },
          removed: function() {
            todoService.updateTodosTime();
            if ($scope.list.length == 0) {
              todoService.resetList();
              $scope.list = todoService.getTodos();
            }
          }
        };

        $scope.remaining = function() {
          var count = 0;
          angular.forEach($scope.list, function(todo) {
            count += todo.done ? 0 : 1;
          });
          return count;
        };

        $scope.archive = function() {
          var oldTodos = $scope.list;
          $scope.list = [];
          angular.forEach(oldTodos, function(todo) {
            if (!todo.done) $scope.list.push(todo);
          });
        };

    });


})();
