const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, testUserOne, setupDataBase} = require('./fixtures/db')

beforeEach(setupDataBase);

const testUserTwo = {
    name: "Jakub-test2",
    email: "jakub.hajduk2@gmail.com",
    password: "Qwerty1234!"
};

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send(testUserTwo).expect(201)
    
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
});

test('Should login existin user', async () => {
    const response = await request(app).post('/users/login').send({
        email: "jakub.hajduk11@gmail.com",
        password: "Qwerty1234!"
    }).expect(200);

    const user = await User.findById(userOneId);
    secondToken = user.tokens[1].token;

    expect(secondToken).toBe(response.body.token);
});

test('Login failed successfully', async () => {
    await request(app).post('/users/login').send({
        email: "jakub.hajduk1@gmail.com",
        password: "Qwerty12345!"
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set({})
        .send()
        .expect(401);
});

test('Should upload avatar img', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

        const user = await User.findById(userOneId);
        
        expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update user name', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send({name: 'Kuba'})
        expect(200);

    const user = await User.findById(userOneId);

    expect(user.name).toEqual('Kuba');
});

// test('Should delete account uesr', async () => {
//     await request(app)
//         .delete('/users/me')
//         .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
//         .send()
//         .expect(200);
// });