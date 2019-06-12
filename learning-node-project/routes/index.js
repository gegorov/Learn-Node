const express = require('express');

const storeController = require('../controllers/storeController');

const router = express.Router();
const { catchErrors } = require('../handlers/errorHandlers');
// Do work here
router.get('/', storeController.homepage);

router.get('/stores', storeController.getStores);

router.get('/add', storeController.addStore);

router.post('/add', catchErrors(storeController.createStore));

router.get('/stores/:id/edit', storeController.editStore);

module.exports = router;
