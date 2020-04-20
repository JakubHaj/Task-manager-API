const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
 
    try {
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});
// Log out from one device
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

//Logout from all devices
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

//To delete
router.get('/users', auth, async (req, res) => {
    
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
        const allowedUpdates = ['name', 'age', 'email', 'password'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => {
            return allowedUpdates.includes(update);
        });

        if (!isValidOperation) {
            return res.status(400).send('Wrong update!');       
        }
    
    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        sendCancelationEmail(req.user.email, req.user.name);
        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(undefined, true);
        } else {
            cb(new Error('File must be a image!'));
        }
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({    width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({  error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user.avatar);
}, (error, req, res, next) => {
    res.status(400).send({  error: error.message});
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png').send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;