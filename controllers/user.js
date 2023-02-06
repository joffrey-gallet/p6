const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




exports.signup = (req, res, next) => {
    // hash password, 10 times
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //save user in DB
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({ error }))

        })
        .catch(error => res.status(500).json({ error }))

};

exports.login = (req, res, next) => {
    // check if user already exists
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user === null) {
                res.status(401).json({ message: "Email ou Mot de passe incorrect" });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(401).json({ message: "Email ou Mot de passe incorrect" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                                    expiresIn: "24h",
                                }),
                            });
                        }
                    })
                    .catch((error) => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};