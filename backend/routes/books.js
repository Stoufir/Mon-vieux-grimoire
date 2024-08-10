const express = require('express');
const auth = require('../middleware/auth'); 
const router = express.Router();
const bookCtrl = require('../controllers/books');
const multer = require('../middleware/multer-config');


//Methode post 
router.post('/:id/rating', auth, bookCtrl.createRating);
router.post('/',auth, multer, bookCtrl.createBook);

//Methode put 
router.put('/:id', auth, bookCtrl.modifyBook);
  
//Methode delete
router.delete('/:id', auth, bookCtrl.deleteBook);
  
//Methode get
router.get('/bestrating', bookCtrl.getBestrating);
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);

  

module.exports = router;