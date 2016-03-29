var Q = require('q');
var Models = require('../models');
var AppUtil = require('../utils/app-utils');
var MyUtil = require('../utils/common-utils');

exports.getLabels = function (req, res, next) {
    if (req.params.id) {
        Models.Label.findOne({
            where: {id: req.params.id}
        }).then(function (label) {
            return res.json(label)
        }).catch(function (err) {
            next(err);
        })
    } else {
        Q.all([
            Models.Memo.count(),
            Models.Label.findAll()
        ]).spread(function (totalCount, labels) {
            var promises = [];
            labels.map(function (label) {
                promises.push(label.getMemos().then(function (memos) {
                    label.dataValues.memoCount = memos.length;
                }));
                Q.all(promises).then(function () {
                    return res.json({
                        totalCount: totalCount,
                        labels: labels
                    });
                }).catch(function (err) {
                    next(err);
                });
            });
        }).catch(function (err) {
            next(err);
        })
    }
};

exports.getAutocompleteLabels = function (req, res, next) {
    var data = [];
    if (!req.query.labelTitle) {
        return res.json(data);
    }

    Models.Label.findAll({
        attributes: ["id", "title"],
        where: {title: {$like: "%" + req.query.labelTitle + "%"}}
    }).then(function (labels) {
        labels.map(function (label) {
            data.push({value: label.title, data: label.title});
        });
        return res.json({
            "query": "Unit",
            "suggestions": data
        });
    }).catch(function (err) {
        next(err);
    });
};

exports.createLabel = function (req, res, next) {
    req.assert('title', '라벨명을 입력하세요').notEmpty();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    var data = AppUtil.makeData({}, Models.Label.getUpdateFields(), req.body);
    Models.Label.create(data).then(function (created) {
        if (!MyUtil.isEmptyObj(created)) res.json(created);
        else res.status(500).end("라벨 생성 실패");
    }).catch(function (err) {
        next(err);
    });
};

exports.updateLabel = function (req, res, next) {
    req.assert('id', '라벨 ID가 없습니다').notEmpty();
    req.assert('title', '라벨명을 입력하세요').notEmpty();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    var data = AppUtil.makeData({}, Models.Label.getUpdateFields(), req.body);
    Models.Label.update(data, {where: {id: req.params.id}}).then(function (updated) {
        if (updated[0] > 0) res.status(200).end("라벨 업데이트 성공");
        else res.status(500).end("라벨 업데이트 실패");
    }).catch(function (err) {
        next(err);
    });
};

exports.deleteLabel = function (req, res, next) {
    req.assert('id', '라벨 ID가 없습니다').isInt();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    if (req.params.id == 1)
        return res.status(400).end("기본 라벨 삭제 불가");

    Models.Label.destroy({where: {id: req.params.id}}).then(function (deleted) {
        if (deleted > 0) res.status(200).end("라벨 삭제 성공");
        else res.status(500).end("라벨 삭제 실패");
    }).catch(function (err) {
        next(err);
    });
};

// label memo associations

exports.getLabelMemos = function (req, res, next) {
    req.assert('id', '라벨 ID가 없습니다').notEmpty();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    Models.Label.findById(req.params.id).then(function (label) {
        label.getMemos().then(function (memos) {
            res.json({
                label: label,
                memos: memos
            })
        }).catch(function (err) {
            next(err);
        });
    }).catch(function (err) {
        next(err);
    });
};

/**
 * req.body
 *
 * memoID: integer
 * label: {id: INT, title: STRING}  둘중하나
 */
exports.addLabelToMemo = function (req, res, next) {
    req.assert('memoID', '메모 ID가 없습니다').isInt();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);
    if (!req.body.label) return res.status(400).end("라벨 정보가 없습니다");
    var whereCondition;
    if (req.body.label.id) whereCondition = {id: req.body.label.id};
    if (req.body.label.title) whereCondition = {title: req.body.label.title};
    if (!whereCondition) return res.status(400).end("라벨 정보가 없습니다");

    var errCallback = function (err) {
        next(err)
    };

    var addLabel = function (label) {
        Models.Memo.findById(req.body.memoID).then(function (memo) {
            if (memo === null)
                return res.status(400).end("존재하지 않는 메모입니다");

            label.addMemo(memo).then(function () {
                res.status(200).json(label);
            }).catch(errCallback);
        }).catch(errCallback);
    };

    Models.Label.findOne({
        attributes: ["id", "title"],
        where: whereCondition
    }).then(function (label) {

        // create label if not exist
        if (label === null) {
            if (whereCondition.id)
                return res.status(400).end("존재하지 않는 라벨입니다");
            else {
                Models.Label.create(whereCondition).then(function (createdLabel) {
                    label = createdLabel;
                    if (label === null)
                        return res.status(500).end("라벨 생성에 실패하였습니다");
                    return addLabel(label);
                })
            }
        } else {
            return addLabel(label);
        }

    }).catch(errCallback);

};

/**
 * req.body
 *
 * memoID: INT
 * labelID: INT
 */
exports.removeLabelFromMemo = function (req, res, next) {
    req.assert('labelID', '라벨 ID가 없습니다').isInt();
    req.assert('memoID', '메모 ID가 없습니다').isInt();
    var errors = req.validationErrors();
    if (errors) return res.status(400).json(errors);

    var errCallback = function (err) {
        next(err)
    };

    Models.Label.findById(req.body.labelID).then(function (label) {
        if (label === null)
            return res.status(400).end("존재하지 않는 라벨입니다");
        Models.Memo.findById(req.body.memoID).then(function (memo) {
            if (label === null)
                return res.status(400).end("존재하지 않는 메모입니다");
            label.removeMemo(memo).then(function () {
                res.status(200).end("메모-라벨 삭제 성공")
            }).catch(errCallback);
        }).catch(errCallback);
    }).catch(errCallback);
};