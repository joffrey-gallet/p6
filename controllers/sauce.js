const Sauce = require("../models/Sauce");
//manage files
const fs = require('fs');

// CRUD

//Create
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //create new object
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
    });
    //save in DB
    sauce.save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

//Update
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const filename = sauce.imageUrl.split("images/")[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) console.log(error);
                });
            })
            .catch((error) => res.status(500).json({ error }));
    }
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};

// Delete
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
                    .catch((error) => res.status(400).json({ error }));
            })

        })
        .catch((error) => res.status(500).json({ error }));
};

//Read
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

//like and Dislike
exports.likeDislike = (req, res, next) => {
    switch (req.body.like) {
        //update like or dislike
        case 0:
            //find if a like already exists
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find((user) => user === req.body.userId)) {
                        console.log(sauce.usersLiked);

                        //update by deleting with inc operator -1. pull operator delete and replace
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId },
                            }
                        )
                            .then(() => {
                                res.status(201).json({ message: "Vote enregistré !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                    if (sauce.usersDisliked.find((user) => user === req.body.userId)) {

                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId },
                            }
                        )
                            .then(() => {
                                res.status(201).json({ message: "Vote enregistré !" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error });
                            });
                    }
                })
                .catch((error) => {
                    res.status(404).json({ error });
                });
            break;
        // like 
        case 1:
            Sauce.updateOne(
                { _id: req.params.id },
                {

                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                }
            )
                .then(() => {
                    res.status(201).json({ message: "Like enregistré !" });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
            break;

        //dislike
        case -1:
            Sauce.updateOne(
                { _id: req.params.id },
                {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                }
            )
                .then(() => {
                    res.status(201).json({ message: " Dislike enregistré !" });
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
            break;
        default:
            console.error("bad request");
    }
};