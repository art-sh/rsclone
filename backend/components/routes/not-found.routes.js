const router = require('express').Router();
const mixin = require('../../helpers/mixin');

const errorResponse = (req, res) => {
  mixin.jsonBad({message: 'Not Found'}, 404, res);
};

router.get('*', errorResponse);
router.post('*', errorResponse);
router.put('*', errorResponse);
router.delete('*', errorResponse);

module.exports = router;
