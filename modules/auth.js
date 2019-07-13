const jwt = require('jsonwebtoken')

const { encrypt } = require('./helpres')

const Users = require('../models/users.model')

exports.login = (req, res) =>
    Users.findOne({ username: req.body.username }, (error, result) => {
        if (error) return res.status(500).json({ error });
        if (!result) return res.status(404).json({ result: 'user not found' });

        if (result.password == encrypt(req.body.password, result.salt)) {
            const token = jwt.sign({
                userId: result._id
            }, 'secretcode123', { expiresIn: '1h' });
            return res.json({ result: token })
        } else {
            return res.status(404).json({ result: 'user not found' });
        }
    })