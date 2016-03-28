app.controller("IndexController", function ($scope, $location) {
    var controller = this;
    controller.path = $location.path();

    console.log("Path : ",$location.path());
    console.log("Hash : ",$location.hash());

}).controller("HomeController", function ($http) {

});