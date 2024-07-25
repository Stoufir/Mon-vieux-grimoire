const express = require('express');

const app = express();

const mongoose = require('mongoose');

const Thing = require('./models/Things');


mongoose.connect('mongodb+srv://stoufir:motdepasse@cluster0.ooefglk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//Methode post 
app.post('/api/stuff', (req, res, next) => {
  delete req.body._id;
  const thing = new Thing ({
    ...req.body
  });
  thing.save()
  .then(() => res.status(201).json ({ message : 'Objet ok'}))
  .catch(error => res.status(400).json ({error}));
});

//Methode put 
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

//Methode delete
app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

//Methode get
app.use('/api/books', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;