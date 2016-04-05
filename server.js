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
app.set('env', process.env.SERVICE_MODE);

// app.use('/bower',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public/dist'));          // set the static files location /public/img will be /img for users
if (app.get('env') === "development") app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));         // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                   // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(session({
    resave: false,
    saveUninitialized: true,
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

console.log();
var isDevMode = (process.env.SERVICE_MODE === "development");

// Monitoring
if (isDevMode) {
    app.use(AppUtil.showHeaderPath);
    app.use(AppUtil.showRequestArgs);
}

// Set Router
app.use(require('./router'));

// Error Handler
app.use(errorHandler());

// listen (start app with node server.js) ======================================
models.sequelize.sync({force: isDevMode}).then(function () {

    // Generate Example Data
    if (isDevMode) {
        var baseDataPromises = [

            // Labels
            models.Label.create({title: "TODO", description: "This is What i need to do"}),
            models.Label.create({
                title: "살것",
                description: "두번째 라벨 : HTML is great for declaring static documents"
            }),
            models.Label.create({title: "할것", description: ""}),
            models.Label.create({title: "오키도키요", description: ""}),
            
            // Memos
            models.Memo.create({title: "test 111", content: "테스트 짧은 메모"}),
            models.Memo.create({
                title: "test 222",
                content: "테스트 긴 메모, 쾌도 홍길동 이후로 사극에서 만나고 싶었던 장근석의 출연. 그리고 성인이 된 첫 작품으로 또 사극을 선택한 여진구. 왠지 사극 왕에는 안 어울릴 것 같은 숙종의 최민수. 때로는 인자하게.. 때로는 비열하게 연기하는 사극 연기 지존 전광렬!"
            }),
            models.Memo.create({title: "블로깅하기", content: "아직 공부해야할 것이 많습니다."}),
            models.Memo.create({title: "디자인패턴 공부", content: "이건 도서관 가야할듯. 책이 넘 비싸거든.."}),
            models.Memo.create({title: "apple computer", content: "iMac 간지 끝남.."}),
            models.Memo.create({title: "apple laptop", content: "Macbook 갖고싶드아..."}),
            models.Memo.create({title: "재미있는게임 찾기", content: "무슨게임이 재미있을까요? 롤은 너무 어렵습니다."})
        ];
        Q.all(baseDataPromises).spread(function (l1, l2, l3, l4, m1, m2, m3, m4, m5, m6, m7) {
            l1.addMemos([m3, m4]);
            l2.addMemos([m1, m2, m5, m6]);
            l3.addMemos([m1, m2, m3, m4, m7]);
        }).catch(function (err) {
            console.log(err);
        })
    }

    app.listen(app.get('port'), function () {
        console.log('\nHTTP Server listening on port %d in %s mode', app.get('port'), app.get('env'), '\n');
    });
});
