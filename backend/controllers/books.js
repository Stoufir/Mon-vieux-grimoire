const Book = require('../models/book');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Création d'un livre
exports.createBook = async (req, res, next) => {
  try {
      const bookObject = JSON.parse(req.body.book);
      delete bookObject._id;
      delete bookObject._userId;


      const filename = `${Date.now()}-${req.file.originalname.split('.')[0]}.jpg`;
      const outputPath = path.join('images', filename);


      await sharp(req.file.buffer)
          .resize(800) 
          .jpeg({ quality: 80 }) 
          .toFile(outputPath);

      const book = new Book({
          ...bookObject,
          userId: req.auth.userId,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${filename}`
      });

      await book.save();
      res.status(201).json({ message: 'Objet enregistré et image optimisée!' });

  } catch (error) {
      res.status(400).json({ error });
  }
};

// Récupération d'un livre 
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(400).json({ error }));
  };
  
// Récupération de toute les livres  
 exports.getAllBooks =  (req, res, next) => {
    Book.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };

  // Modification d'un livre
  exports.modifyBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

// Suppression d'un livre
  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(404).json({ error });
        });
};


exports.getBestrating = (req, res, next) => {
  Book.find()
      .sort({ averageRating: -1 })
      .limit(3)
      .then(books => res.status(200).json(books))
      .catch(error => {
          console.error('Erreur lors de la récupération des livres:', error);
          res.status(500).json({ message: 'Erreur interne du serveur', error });
      });
};

exports.createRating = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then(book => {
			const hasAlreadyVoted = book.ratings.find(rating => rating.userId === req.auth.userId);
			if (!hasAlreadyVoted) {
				book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

				const ratings = book.ratings.map(rating => rating.grade);
				let averageRating =
					ratings.reduce((previous, current) => {
						return previous + current;
					}, 0) / ratings.length;
				averageRating = averageRating.toFixed(1);

				Book.findByIdAndUpdate(
					{ _id: req.params.id },
					{ ratings: book.ratings, averageRating: averageRating },
					{ new: true }
				)
					.then(book => res.status(200).json(book))
					.catch(error => res.status(401).json({ error }));
			} else {
				return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
			}
		})
		.catch(error => {
			return res.status(500).json({ error });
		});
};