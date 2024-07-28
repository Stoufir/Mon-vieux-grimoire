const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
  console.log("Request body:", req.body); // Log pour vérifier le contenu de req.body

  delete req.body._id;

  const thing = new Thing({
    ...req.body
  });

  thing.save()
    .then(() => {
      console.log("Objet enregistré avec succès !");
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch(error => {
      console.error("Erreur lors de l'enregistrement de l'objet:", error);
      res.status(400).json({ error });
    });
};


  exports.modifyThing = (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.getAllBooks =  (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteThing =  (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  }; 

  exports.getOneThing = (req, res, next) => {
    Thing.findOne ({ _id: req.params.id })
    .then((thing) => { res.status(200).json(thing)})
    .catch ((error) => { res.status(404).json({ error })})
  };