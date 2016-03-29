var MyUtils = require('./common-utils');

exports.showHeaderPath = function (req, res, next) {
    console.log("HEADERS : ", req.headers);
    console.log("REQ PATH : ", req.path);
    next();
};

exports.showRequestArgs = function (req, res, next) {

    if (!MyUtils.isEmptyObj(req.params)) {
        console.log("\nREQUEST PARAMS : ", req.params);
    }
    if (!MyUtils.isEmptyObj(req.query)) {
        console.log("\nREQUEST QUERY : ", req.query);
    }
    if (!MyUtils.isEmptyObj(req.body)) {
        console.log("\nREQUEST BODY : ", req.body);
    }
    console.log("\n");
    next();
};

exports.makeData = function (data, keys, reqBody) {
    keys.map(function (key) {
        if (reqBody[key] !== undefined)
            data[key] = reqBody[key]
    });
    return data;
};

exports.formatRowValues = function (rows, option) {
    if (!option) {
        option = {
            recursive: true,
            formatDate: true,
            formatCurrency: true
        }
    }

    var dateFields = ["created_at", "updated_at"];
    for (var i in rows) {
        var row = rows[i];
        if (MyUtils.isEmptyObj(row))
            return;
        if (row.dataValues)
            row = row.dataValues;
        for (var field in row) {
            if (typeof row[field] === "object" && !MyUtils.isEmptyObj(row[field]) && option.recursive) {
                if (Array.isArray(row[field]))
                    formatRowValues(row[field]);
                else
                    formatRowValues([row[field]]);
            } else if (MyUtils.isArrayContains(dateFields, field) && option.formatDate) {
                row[field] = MyUtils.getDateStringByDate(row[field]);
            }
        }
    }
};