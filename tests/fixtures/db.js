const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();

const testUserOne = {
    _id: userOneId,
    name: "Jakub-test1",
    email: "jakub.hajduk11@gmail.com",
    password: "Qwerty1234!",
    tokens: [{
        token: jwt.sign({   _id: userOneId}, process.env.JWT_SECRET_KEY)
    }]
};

const userThreeId = new mongoose.Types.ObjectId();

const testUserThree = {
    _id: userThreeId,
    name: "Jakub-test3",
    email: "jakub.hajduk33@gmail.com",
    password: "Qwerty1234!",
    tokens: [{
        token: jwt.sign({   _id: userThreeId}, process.env.JWT_SECRET_KEY)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'another task',
    completed: true,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'next task',
    completed: false,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'next task for 3',
    completed: false,
    owner: userThreeId
}

const setupDataBase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(testUserOne).save();
    await new User(testUserThree).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    testUserOne,
    setupDataBase,
    userThreeId,
    testUserThree
}