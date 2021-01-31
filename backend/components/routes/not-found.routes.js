const router = require('express').Router();

const errorResponse = (req, res) => {
  res.status(404).send(res.send('Not Found'));
};

router.get('*', errorResponse);
router.post('*', errorResponse);
router.put('*', errorResponse);
router.delete('*', errorResponse);

module.exports = router;
