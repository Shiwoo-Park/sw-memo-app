var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

exports.isInt = function (s) {
    return (s % 1) === 0;
};

exports.isNumStr = function (s) {
    var nums = {
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true,
        '7': true,
        '8': true,
        '9': true,
        '0': true
    };
    for (var i = 0; i < s.length; i++) {
        if (!nums[s.charAt(i)]) {
            return false;
        }
    }
    return true;
};

exports.splitWhitespace = function (s) {
    return s.match(/\S+/g);
};

exports.rmWhiteSpaces = function (s) {
    return s.match(/\S+/g).join('')
};

exports.isArrayContains = function (array, element) {
    return (array.indexOf(element) >= 0);
};

exports.replaceAll = function (text, orgStr, destStr) {
    return text.split(orgStr).join(destStr);
};

exports.getDicStr = function (dic) {
    return JSON.stringify(dic);
};

exports.getArrayStr = function (array) {
    return array.toString();
};

exports.getDicKeys = function (dic) {
    return Object.keys(dic);
};

exports.getDicSize = function (dic) {
    return Object.keys(dic).length;
};

exports.getGMTDate = function (date) {
    // Needs localizing (Initially Korean standard)
    return new Date(date.getTime() - (9 * 1000 * 60 * 60))
};

exports.getDateStringByDate = function (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return year + "-" + (month < 10 ? "0" + month : month) + "-"
        + (day < 10 ? "0" + day : day) + " "
        + (hour < 10 ? "0" + hour : hour) + ":"
        + (min < 10 ? "0" + min : min) + ":"
        + (sec < 10 ? "0" + sec : sec);

    //dateFormatMod.masks.basicTime = "yyyy-mm-dd HH:MM:ss";
    //return dateFormatMod(date, "basicTime");
};

exports.getDateStringByTimestamp = function (timestamp) {
    var date = new Date(timestamp);
    return this.getDateStringByDate(date);
};

exports.getNowDate = function () {
    return this.getDateStringByTimestamp(Date.now());
};

exports.stringStartsWith = function (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
};

exports.stringEndsWith = function (string, suffix) {
    return suffix == '' || string.slice(-suffix.length) == suffix;
};

exports.showTime = function () {
    var d = new Date();
    console.log("ShowTime : " + d.toLocaleString() + " (" + d.getTime() + ")");
};

exports.isEmptyDic = function (dic) {
    for (var prop in dic) {
        if (dic.hasOwnProperty(prop))
            return false;
    }
    return true;
};

exports.isEmptyObj = function (obj, isWeakCheck) {
    if (obj === undefined) return true;
    if (obj === null) return true;
    if (typeof obj === "string") obj = obj.trim();
    if (obj === "") return true;

    if (isWeakCheck)
        return false;

    if (typeof obj === "string") {
        if (obj === "[]") return true;
        if (obj === "{}") return true;
    }

    if (typeof obj === "object") {
        if (obj === []) return true;
        if (obj === {}) return true;
        if (Object.keys(obj).length === 0) return true;
    }

    return false;
};

exports.mergeDics = function (srcDic, destDic, override) {
    for (var attrName in srcDic) {
        if (override)
            destDic[attrName] = srcDic[attrName];
        else {
            if (destDic[attrName])
                continue;
            destDic[attrName] = srcDic[attrName];
        }

    }
    return destDic;
};

exports.makeDicByKeys = function (srcDic, keys) {
    /*
     - Extract KV data from srcDic by only input 'keys'
     srcDic : Object
     keys : array
     */
    var dicKeys = Object.keys(srcDic);
    var retDic = {};

    for (var i = 0; i < dicKeys.length; i++) {
        var key = dicKeys[i];
        if (keys.indexOf(key) >= 0) {
            retDic[key] = srcDic[key];
        }
    }

    return retDic;
};


exports.hashPassword = function (pwd, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            callback(err, "");
        }
        bcrypt.hash(pwd, salt, null, function (err, hash) {
            if (err) {
                callback(err, "");
            }
            callback(null, hash);
        });
    });
};

exports.comparePassword = function (candidatePassword, correctPassword, cb) {
    bcrypt.compare(candidatePassword, correctPassword, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

exports.encryptByAES = function (plainText, secret) {
    var useSecret = process.env.AES_SECRET;
    if (secret) useSecret = secret;
    var encipher = crypto.createCipher('aes-256-cbc', useSecret);
    var encryptdata = encipher.update(plainText, 'utf8', 'binary');

    encryptdata += encipher.final('binary');
    var encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
    return encode_encryptdata;
};

exports.decryptByAES = function (cipherText, secret) {
    var useSecret = process.env.AES_SECRET;
    if (secret) useSecret = secret;
    cipherText = new Buffer(cipherText, 'base64').toString('binary');

    var decipher = crypto.createDecipher('aes-256-cbc', useSecret);
    var decoded = decipher.update(cipherText, 'binary', 'utf8');

    decoded += decipher.final('utf8');
    return decoded;
};

exports.getHashMD5 = function (inputValue, digestOption) {
    if (typeof inputValue !== "string")
        inputValue = inputValue.toString();
    if (!digestOption)
        digestOption = 'hex';

    return crypto.createHash('md5').update(inputValue).digest(digestOption);
};

exports.getHashSHA256 = function (inputValue, digestOption) {
    // digestOption : base64 | hex | ""
    if (typeof inputValue !== "string")
        inputValue = inputValue.toString();
    if (!digestOption)
        digestOption = 'hex';

    return crypto.createHash('sha256').update(inputValue).digest(digestOption);
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
exports.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
exports.getRandomInt = function (min, max) {
    if (max < min) max = min + 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.commaSeparateNumber = function (val) {
    try {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    } catch (err) {
        console.log("[ERROR] commaSeparateNumber : ", err);
        return null
    }
};

exports.removeCommaNumber = function (val) {
    if (typeof val === "string")
        val = val.split(',').join('');
    return val
};

exports.blindPartialData = function (val) {
    // Email 의 ID 부분을 짝수 위치 문자만 *로 바꿔줌.
    var l = val.length;
    var ret = [];
    var isAfterAt = false;
    for (var i = 0; i < l; i++) {
        if (val.charAt(i) == "@")
            isAfterAt = true;

        if (i % 2 === 0 || isAfterAt)
            ret.push(val.charAt(i));
        else
            ret.push("*");
    }
    return ret.join('');
};
