window.APPENV = {
    // Affects to CORS issues (Reject other Cross Domain XMLHttpRequests)
    // 접근 도메인과 아래 도메인이 일치해야 한다. 그렇지 않을 경우 Ajax Request 전부  REJECT 됨.
    // domain: "http://localhost:8000"
    domain: "http://127.0.0.1:8000"
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