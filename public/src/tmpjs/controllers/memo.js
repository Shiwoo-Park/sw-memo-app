app.controller("MemoListController", function ($scope, $routeParams, swMemoApi) {
    var labelID = $routeParams.labelID;

    var loadMemos = function () {
        if (labelID) { // memos for specific label
            swMemoApi.get("/api/labels/" + labelID + "/memos").success(function (data) {
                console.log(data);
                $scope.label = data.label;
                $scope.memos = data.memos;
            });
        } else { // all memo
            swMemoApi.get("/api/memos").success(function (memos) {
                $scope.memos = memos;
            });
        }
    };

    loadMemos();

    $scope.removeMemo = function (id) {
        swMemoApi.delete('/api/memos/' + id)
            .success(function (data) {
                loadMemos();
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

}).controller("MemoEditController", function ($scope, $routeParams, $location, swMemoApi) {
    $scope.memo = {};
    $scope.labels = {};

    if ($routeParams.memoID) { // 기존 메모 업데이트
        swMemoApi.get("/api/memos/" + $routeParams.memoID).success(function (data) {
            $scope.memo = data.memo;
            data.labels.map(function (label) {
                $scope.labels[label.id] = label;
            });
        });
    }else if($routeParams.labelID){ // 새로운 메모 생성 (with 라벨)
        swMemoApi.get('/api/labels/'+$routeParams.labelID)
            .success(function (data) {
                $scope.labels[data.id] = data;
            })
    }

    // 메모 라벨 추가
    $scope.addLabelToMemo = function (labelID) {
        swMemoApi.post('/api/labels/' + labelID + '/memos/' + $scope.memo.id)
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // 여러개 라벨 추가
    $scope.addLabelsToMemo = function () {
        swMemoApi.put('/api/memos/' + $scope.memo.id+'/labels', $scope.labels)
            .success(function (data) {
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // 메모 라벨 삭제
    $scope.removeLabelFromMemo = function (labelID) {
        swMemoApi.delete('/api/labels/' + labelID + '/memos/' + $scope.memo.id)
            .success(function (data) {
                delete $scope.labels[labelID];
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // 메모 추가
    $scope.createMemo = function () {
        var data = $scope.memo;
        if($routeParams.labelID)
            data.labelID = $routeParams.labelID;
        swMemoApi.post('/api/memos', data)
            .success(function (data) {
                $location.url('/memos');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    // 메모 업데이트
    $scope.updateMemo = function () {
        swMemoApi.put('/api/memos/' + $scope.memo.id, $scope.memo)
            .success(function (data) {
                $location.url('/memos');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});