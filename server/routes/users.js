const router = require(`express`).Router()
const usersModel = require(`../models/users`)
const bcrypt = require(`bcrypt`)

router.post(`/users/register/:name/:email/:password`, (req, res) => {
    console.log(req.params.name);

    // Check if user already exists
    usersModel.findOne({ email: req.params.email }).then(uniqueData =>
    {
        if (uniqueData) {
            res.json({ errorMessage: `User already exists` })
        }
        else
        {
            bcrypt.hash(req.params.password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS) ).then(hash =>
            {
                usersModel.create({ name: req.params.name, email: req.params.email, password: hash }).then(data =>
                {
                    if (data)
                    {
                        res.json({ name: data.name })
                    }
                    else
                    {
                        res.json({ errorMessage: `User was not registered` })
                    }
                })
            })
        }
    })
})

module.exports = router;
