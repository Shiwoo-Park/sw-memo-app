app.controller("LabelListController", function ($scope, swMemoApi) {
    $scope.labels = [];
    $scope.totalCount = 0;

    var loadLabels = function () {
        swMemoApi.get("/api/labels").success(function (data) {
            $scope.totalCount = data.totalCount;
            $scope.labels = data.labels;
        });
    };
    
    loadLabels();

    $scope.removeLabel = function (id) {
        swMemoApi.delete('/api/labels/' + id)
            .success(function (data) {
                loadLabels();
                console.log(data);
            })
            .error(function (data) {
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