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

}).controller("MemoEditController", function ($scope, $routeParams, $location, swMemoApi) {
    $scope.memo = {};
    $scope.labels = {};
    var addLabelTitleInput = $('#autocomplete');

    if ($routeParams.memoID) { // 기존 메모 업데이트
        swMemoApi.get("/api/memos/" + $routeParams.memoID).success(function (data) {
            $scope.memo = data.memo;
            data.labels.map(function (label) {
                $scope.labels[label.id] = label;
            });
        });
    } else if ($routeParams.labelID) { // 새로운 메모 생성 (with 라벨)
        swMemoApi.get('/api/labels/' + $routeParams.labelID)
            .success(function (data) {
                $scope.labels[data.id] = data;
            });
    }

    // 메모 라벨 추가
    $scope.addLabelToMemo = function () {
        var addLabelTitle = addLabelTitleInput.val();
        if(!addLabelTitle) {
            return alert("라벨명을 입력해주세요");
        }
        var data = {
            label: {title:addLabelTitle},  // id or title
            memoID: $scope.memo.id
        };
        swMemoApi.post('/api/label-memo', data)
            .success(function (data) {
                console.log(data);
                $scope.labels[data.id] = data;
                addLabelTitleInput.val("");
            })
            .error(function (data) {
                alert(data);
            });
    };

    // 기존 라벨 자동완성
    $('#autocomplete').autocomplete({
        serviceUrl: '/api/autocomplete/labels',
        paramName: "labelTitle",
        dataType: "json",
        onSelect: function (suggestion) {
            $scope.addLabelToMemo();
            // alert('You selected: ' + suggestion.value + ', ' + suggestion.data);
        }
    });

    // 메모 라벨 삭제
    $scope.removeLabelFromMemo = function (labelID) {
        var data = {
            labelID: labelID,
            memoID: $scope.memo.id
        };
        swMemoApi.delete('/api/label-memo', data)
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
        if ($routeParams.labelID)
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

    // 메모 삭제
    $scope.removeMemo = function (id) {
        swMemoApi.delete('/api/memos/' + id)
            .success(function (data) {
                $location.url('/memos');
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});