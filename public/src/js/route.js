app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: "templates/home.html",
        controller: "HomeController"

    }).when('/labels/:labelID/memos', {
        templateUrl: "templates/memo-list.html",
        controller: "MemoListController"

    }).when('/labels/:id', {
        templateUrl: "templates/label-edit.html",
        controller: "LabelEditController"

    }).when('/labels', {
        templateUrl: "templates/label-list.html",
        controller: "LabelListController"

    }).when('/labels/create', {
        templateUrl: "templates/label-edit.html",
        controller: "LabelEditController"

    }).when('/labels/:labelID/memos/create', {
        templateUrl: "templates/memo-edit.html",
        controller: "MemoEditController"

    }).when('/memos/:memoID', {
        templateUrl: "templates/memo-edit.html",
        controller: "MemoEditController"

    }).when('/memos', {
        templateUrl: "templates/memo-list.html",
        controller: "MemoListController"

    }).when('/memos/create', {
        templateUrl: "templates/memo-edit.html",
        controller: "MemoEditController"

    }).otherwise({
        templateUrl: "templates/404.html"
    });
});