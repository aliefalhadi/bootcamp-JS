const Users = require('../models/users.model');
const { encrypt } = require('../modules/helpres');
const uid = require('uid');

exports.userList = (req, res) => {
    return Users.find({}, (error, result) => {
        if (error) return res.status(500).json({ error })
        return res.json({ result })
    }).select('-password, -salt')
}

exports.getUserById = (req, res) => {
    Users.findOne({ _id: req.params.id }, (error, result) => {
        if (error) return res.status(500).json({ error })
        return res.json({ result })
    }).select('-password, -salt')
}


exports.addUser = (req, res) => {
    const salt = uid(10);

    req.body.password = encrypt(req.body.password, salt)
    req.body.salt = salt

    Users.create(req.body, (err, _) => {
        if (err) return res.status(500).json({ err })
        return res.json({ result: 'success' })
    })
}


exports.editUser = (req, res) => {
    if (req.body.password) delete req.body.password
    if (req.body.salt) delete req.body.salt
    Users.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (error, result) => {
        if (error) return res.status(500).json({ error })
        return res.json({ result })
    })
}

exports.deleteUser = (req, res) => {
    Users.deleteOne({ _id: req.params.id }, (err, _) => {
        if (err) return res.status(500).json({ err })
        return res.json({ result: 'success deleted' })
    })
}