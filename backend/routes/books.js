const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/books');

//Methode post 
router.post('/', bookCtrl.createThing);
  
//Methode put 
router.put('/:id', bookCtrl.modifyThing);
  
//Methode delete
router.delete('/:id', bookCtrl.deleteThing);
  
//Methode get
router.get('/', bookCtrl.getAllBooks);
router.get('/', bookCtrl.getOneThing);
  

module.exports = router;