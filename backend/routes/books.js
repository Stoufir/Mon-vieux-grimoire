const express = require('express');
const auth = require('../middleware/auth'); 
const router = express.Router();
const bookCtrl = require('../controllers/books');
const multer = require('../middleware/multer-config');


//Methode post 
router.post('/',auth, multer, bookCtrl.createBook);
  
//Methode put 
router.put('/:id', auth, bookCtrl.modifyThing);
  
//Methode delete
router.delete('/:id', auth, bookCtrl.deleteThing);
  
//Methode get
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
  

module.exports = router;