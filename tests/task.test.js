const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {userOneId, testUserOne, setupDataBase, userThreeId, testUserThree} = require('./fixtures/db')

beforeEach(setupDataBase);

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({
            description: 'User task'
        })
        .expect(201);
        
    const task = await Task.findById(response.body._id);

    expect(task.description).toEqual('User task');
});

test('Shoudl get user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});
