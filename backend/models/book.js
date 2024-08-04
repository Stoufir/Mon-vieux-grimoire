// Impport du module Mongoose
const mongoose = require('mongoose');

// Création du schema pour les livres :
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
        userId: { type: String },
        grade: { type: Number },
    }
  ],
  averageRating: { type: Number },
});

// Exportation du modèle Book
module.exports = mongoose.model('Book', bookSchema);