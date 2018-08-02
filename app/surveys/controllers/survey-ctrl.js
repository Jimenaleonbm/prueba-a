'use strict';
angular.module('surveys').controller('SurveyCtrl', function ($scope, $mocifire, $state, $message, $ionicSlideBoxDelegate, $ionicHistory) {

    $scope.response = {};

    $mocifire.get(['event', 'survey']).then(function (survey) {
        $scope.survey = survey;
        $mocifire.get(['surveys', 'types']).then(function (types) {
            $scope.types = types;
            $mocifire.get(['surveys', 'polls', 'event', survey, 'questions']).then(function (questions) {
                $scope.lengthQuestions = Object.keys(questions).length - 1;
                $scope.questions = questions;
                $ionicSlideBoxDelegate.update();
            });
        });
    });

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        $scope.slider = data.slider;
    });

    $scope.element = function (key, res) {
        if ($scope.response[key].indexOf(res) > -1)
            $scope.response[key].splice($scope.response[key].indexOf(res), 1);
        else
            $scope.response[key].push(res);
    }

    $scope.save = function () {
        angular.forEach($scope.response, function (res, id) {
            if ($scope.types[$scope.questions[id].type] == "unica") {
                $mocifire.transaction(['surveys', 'polls', 'event', $scope.survey, 'results', id, res], function (votes) {
                    return votes + 1;
                });
            } else if ($scope.types[$scope.questions[id].type] == "multiple") {
                angular.forEach(res, function (key) {
                    $mocifire.transaction(['surveys', 'polls', 'event', $scope.survey, 'results', id, key], function (votes) {
                        return votes + 1;
                    });
                });
            } else if ($scope.types[$scope.questions[id].type] == "orden") {
                angular.forEach(res, function (key, position) {
                    $mocifire.transaction(['surveys', 'polls', 'event', $scope.survey, 'results', id, key, position], function (votes) {
                        return votes + 1;
                    });
                });
            }
        });
        $message.alert("Tus respuestas se han enviado exitosamente");
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("main.home");
    }

});
