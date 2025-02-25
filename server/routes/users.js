const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const bcrypt = require(`bcrypt`)

router.post(`/users/register/`, (req, res) => {
    console.log(req.body.name);
    // Check if user already exists
    usersModel.findOne({email: req.body.email})
        .then(uniqueData => {
            if (uniqueData) {
                return res.json({errorMessage: `User already exists`});
            } else {
                bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS))
                    .then(hash => {
                        return usersModel.create({name: req.body.name, email: req.body.email, password: hash});
                    })
                    .then(data => {
                        if (data) {
                            res.json({name: data.name});
                        } else {
                            res.json({errorMessage: `User was not registered`});
                        }
                    });
            }
        })
        .catch(err =>
        {
            console.error("Registration error:", err);
            res.status(500).json({errorMessage: `Internal Server Error`});
        });
});
module.exports = router;