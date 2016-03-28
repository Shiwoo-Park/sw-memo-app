"use strict";

// Load environment
var dotenv = require('dotenv');
dotenv.load({path: '.env'});

// Connect to Mysql DB
var models = require("./models");

// set up ========================
var Q = require('q');
var MyUtil = require('./utils/common-utils');
var AppUtil = require('./utils/app-utils');
var express = require('express');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var expressValidator = require('express-validator');

// Express configuration =================
var app = express();  // create our app w/ express
app.set('port', process.env.HTTP_PORT || 8080);

// app.use('/bower',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public/dist'));   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));  // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                            // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(session({
    // resave: false,
    // saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));
app.use(expressValidator({
    customValidators: {
        isArray: function (value) {
            value = JSON.parse(value);
            return Array.isArray(value);
        },
        isNumStr: MyUtil.isNumStr
    }
}));
app.use(methodOverride());

// Monitoring
app.use(AppUtil.showHeaderPath);
app.use(AppUtil.showRequestArgs);

// Set Router
app.use(require('./router'));

// Error Handler
app.use(errorHandler());

// listen (start app with node server.js) ======================================
var testingDB = true;
// var testingDB = false;



models.sequelize.sync({force: testingDB}).then(function () {
    var baseDataPromises = [
        models.Label.create({title: "라벨1", description: "첫번째 라벨"}),
        models.Label.create({title: "라벨2", description: "두번째 라벨 : HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application."}),
        models.Label.create({title: "라벨3", description: ""}),
        models.Label.create({title: "라벨4", description: ""}),
        models.Memo.create({title: "메모1", content: "미지정 메모"}),
        models.Memo.create({
            title: "메모2",
            content: "긴 메모, 쾌도 홍길동 이후로 사극에서 만나고 싶었던 장근석의 출연. 그리고 성인이 된 첫 작품으로 또 사극을 선택한 여진구. 왠지 사극 왕에는 안 어울릴 것 같은 숙종의 최민수. 때로는 인자하게.. 때로는 비열하게 연기하는 사극 연기 지존 전광렬!"
        }),
        models.Memo.create({title: "메모3", content: "짧은 메모"}),
        models.Memo.create({title: "메모4", content: "퐁퐁 퐁퐁"}),
        models.Memo.create({title: "메모5", content: "감사합니다"}),
        models.Memo.create({title: "메모6", content: "AngularJS는 사랑입니다."}),
        models.Memo.create({title: "메모7", content: "무슨게임이 재미있을까요? 롤은 너무 어렵습니다."})
    ];

    Q.all(baseDataPromises).spread(function (l1, l2, l3, l4, m1, m2, m3, m4, m5, m6, m7) {
        l1.addMemos([m3, m2, m4]);
        l2.addMemos([m1, m2, m5, m6, m7]);
        l3.addMemos([m1, m2]);

        app.listen(app.get('port'), function () {
            console.log('HTTP Server listening on port %d in %s mode', app.get('port'), app.get('env'));
        });

    }).catch(function (err) {
        console.log(err);
    })
});
