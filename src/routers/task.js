const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, // copy all the req.body properties to new Task object
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    };
});

//?completed=true
//?limit=10&skip=0
//?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = [];
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        console.log(parts);
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        console.log(sort);
    };

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    };

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate(); // ===  await Task.find({ owner: req.user._id});
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    };
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.id);
        
        const task = await Task.findOne({   _id: req.params.id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send('Task do not exists in db!');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    };
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const allowedUpdates = ['completed', 'description'];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });
    
    try {
       //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{ new: true, runValidators: true});

        const task = await Task.findOne( { _id: req.params.id, owner: req.user._id});
        if (!isValidOperation) {
            return res.status(400).send('Wrong update!');       
        }
        if(!task) {
            return res.status(404).send();
        };

        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        
        const task = await Task.findOneAndDelete({  _id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send();
    }
});

module.exports = router;