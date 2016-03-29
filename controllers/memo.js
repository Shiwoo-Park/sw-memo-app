var Q = require('q');
var Models = require('../models');
var AppUtil = require('../utils/app-utils');
var MyUtil = require('../utils/common-utils');

exports.getMemos = function (req, res, next) {
    var errCallback = function (err) {
        next(err);
    };
    if (req.params.id) { // single memo
        Models.Memo.findOne({
            where: {id: req.params.id}
        }).then(function (memo) {
            memo.dataValues.updated_at = MyUtil.getDateStringByDate(memo.dataValues.updated_at);
            memo.getLabels().then(function (labels) {
                return res.json({
                    memo: memo,
                    labels: labels
                })
            }).catch(errCallback);
        }).catch(errCallback);

    } else { // all memos
        Models.Memo.findAll().then(function (memos) {
            return res.json(memos);
        }).catch(errCallback);
    }
};

exports.createMemo = function (req, res, next) {
    req.assert('title', '메모 제목을 입력하세요').notEmpty();
    var labelID = 1;
    if (req.body.labelID) {
        req.assert('labelID', '라벨 ID는 숫자여야 합니다').isInt();
        labelID = req.body.labelID
    }
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    var errCallback = function (err) {
        next(err);
    };
    var data = AppUtil.makeData({}, Models.Memo.getUpdateFields(), req.body);

    Q.all([
        Models.Label.findById(labelID),
        Models.Memo.create(data)
    ]).spread(function (label, memo) {
        if (MyUtil.isEmptyObj(memo) || MyUtil.isEmptyObj(label))
            res.status(500).end("메모 생성 실패");
        else {
            label.addMemo(memo).then(function () {
                res.end("메모 생성 성공");
            }).catch(errCallback);
        }
    }).catch(errCallback);
};

exports.updateMemo = function (req, res, next) {
    req.assert('id', '메모 ID가 없습니다').notEmpty();
    req.assert('title', '메모 제목을 입력하세요').notEmpty();

    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    var data = AppUtil.makeData({}, Models.Memo.getUpdateFields(), req.body);
    Models.Memo.update(data, {where: {id: req.params.id}}).then(function (updated) {
        if (updated[0] > 0) res.status(200).end("메모 업데이트 성공");
        else res.status(500).end("메모 업데이트 실패");
    }).catch(function (err) {
        next(err);
    });
};

exports.deleteMemo = function (req, res, next) {
    req.assert('id', '메모 ID가 없습니다').notEmpty();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    Models.Memo.destroy({where: {id: req.params.id}}).then(function (deleted) {
        if (deleted > 0) res.status(200).end("메모 삭제 성공");
        else res.status(500).end("메모 삭제 실패");
    }).catch(function (err) {
        next(err);
    });
};