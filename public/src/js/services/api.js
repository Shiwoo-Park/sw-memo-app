app.service('swMemoApi', function ($http) {
    
    var requestTimeout = 3000; // ms

    // this.get = function (url, data, success, failed) {
    //     if (!failed) failed = errAlert;
    //     // $.ajax({method: "GET", url: wrapUrl(url), headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}, timeout: requestTimeout, data: data}).then(success, failed);
    //     $.ajax({method: "GET", url: wrapUrl(url), timeout: requestTimeout, data: data}).then(success, failed);
    // };
    // this.put = function (url, data, success, failed) {
    //     if (!failed) failed = errAlert;
    //     $.ajax({method: "PUT", url: wrapUrl(url), timeout: requestTimeout, data: data}).then(success, failed);
    // };
    // this.post = function (url, data, success, failed) {
    //     if (!failed) failed = errAlert;
    //     $.ajax({method: "POST", url: wrapUrl(url), timeout: requestTimeout, data: data}).then(success, failed);
    // };
    // this.delete = function (url, data, success, failed) {
    //     if (!failed) failed = errAlert;
    //     $.ajax({method: "DELETE", url: wrapUrl(url), timeout: requestTimeout, data: data}).then(success, failed);
    // };

    this.get = function (url, config) {
        return $http.get(wrapUrl(url), config);
    };

    this.head = function (url, config) {
        return $http.head(wrapUrl(url), config);
    };
    
    $http.defaults.headers.delete = {};
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $http.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    this.post = function (url, data) {
        if (!data) data = {};
        return $http({
            method: 'POST',
            url: wrapUrl(url),
            data: $.param(data)
        });
    };

    this.put = function (url, data) {
        if (!data) data = {};
        return $http({
            method: 'PUT',
            url: wrapUrl(url),
            data: $.param(data)
        });
    };

    this.delete = function (url, data) {
        if (!data) data = {};
        return $http({
            method: 'DELETE',
            url: wrapUrl(url),
            data: $.param(data)
        });
    };

});