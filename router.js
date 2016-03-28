var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
var labelController = require('./controllers/label');
var memoController = require('./controllers/memo');

// api ---------------------------------------------------------------------

// Label & Memos
router.get('/api/labels/:id([0-9]+)/memos', labelController.getLabelMemos);
router.post('/api/label-memo', labelController.addLabelToMemo);
router.delete('/api/label-memo', labelController.removeLabelFromMemo);

// Label
router.get('/api/labels/:id([0-9]+)?', labelController.getLabels);
router.get('/api/autocomplete/labels', labelController.getAutocompleteLabels);
router.post('/api/labels', labelController.createLabel);
router.put('/api/labels/:id([0-9]+)', labelController.updateLabel);
router.delete('/api/labels/:id([0-9]+)', labelController.deleteLabel);

// Memo
router.get('/api/memos/:id([0-9]+)?', memoController.getMemos);
router.post('/api/memos', memoController.createMemo);
router.put('/api/memos/:id([0-9]+)', memoController.updateMemo);
router.delete('/api/memos/:id([0-9]+)', memoController.deleteMemo);

router.get('*', function(req, res) {
    res.sendfile('./public/dist/index.html');
    // res.render('home');
});
module.exports = router;