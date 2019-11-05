//npm run dev
const express = require('express');
require('./db/mongoose') // calling a script makes it execute

const app = express();
const port = process.env.PORT;

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});



