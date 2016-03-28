window.APPENV = {
    domain: "http://172.30.1.1:8080" // Affects to CORS issues (Reject other Cross Domain XMLHttpRequests)

};

function wrapUrl(path) {
    var separator = (path.indexOf("/") === 0) ? "" : "/";
    return APPENV.domain + separator + path;
}

function errAlert(err) {
    console.log("errAlert", err);
    
    var msg = err;
    if (typeof err === "object") {
        if (err.responseJSON) {
            if (Array.isArray(err.responseJSON)) {
                msg = err.responseJSON[0].msg;
            } else if (err.responseJSON.msg) {
                msg = err.responseJSON.msg;
            } else {
                msg = err.responseText;
            }
        } else if (err.responseText && !err.responseText.startsWith('<html>')) {
            msg = err.responseText;
        } else {
            msg = "[" + err.status + "] " + err.statusText;
        }
    }
    alert(msg);
}