app.controller("LabelListController", function ($scope, swMemoApi) {
    $scope.labels = [];

    /*
     var loadLabels = function() {
     swMemoApi.get("/api/labels").success(function (labels) {
     $scope.labels = labels;
     });
     };
     loadLabels();

     $scope.removeLabel = function(id) {
     swMemoApi.delete('/api/labels/' + id)
     .success(function(data) {
     loadLabels();
     console.log(data);
     })
     .error(function(data) {
     console.log('Error: ' + data);
     });
     };
     */

    var loadLabels = function () {
        swMemoApi.get("/api/labels", function (labels) {
            $scope.labels = labels;
        });
    };
    loadLabels();

    $scope.removeLabel = function (id) {
        swMemoApi.delete('/api/labels/' + id, function (data) {
            loadLabels();
            console.log(data);
        }, function (data) {
            console.log('Error: ' + data);
        });
    };

}).controller("LabelEditController", function ($scope, $routeParams, $location, swMemoApi) {
    $scope.formData = {};

    if ($routeParams.id) {
        swMemoApi.get("/api/labels/" + $routeParams.id).success(function (label) {
            $scope.formData = {
                id: label.id,
                title: label.title,
                description: label.description
            };
        });
    }

    $scope.createLabel = function () {
        swMemoApi.post('/api/labels', $scope.formData)
            .success(function (data) {
                $location.url('/labels');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.updateLabel = function () {
        swMemoApi.put('/api/labels/' + $scope.formData.id, $scope.formData)
            .success(function (data) {
                $location.url('/labels');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

});