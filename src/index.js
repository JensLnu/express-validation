import express from 'express';
import { query, validationResult, body, cookie } from 'express-validator';
import { users } from './dummy-data-users.js';

import cookieParser from 'cookie-parser'
import session from 'express-session'
import helmet from 'helmet'
import cors from 'cors'


const PORT = 1337;

const app = express();

// HELMET
app.use(helmet()); // set all helemt configs to default

app.use(cookieParser());


// Lägg till säkerhetsinställningar för Cors
app.use(cors({
    origin: "http://localhost:1337/",
    optionsSuccessStatus: 200
}))

app.use(express.json());

app.get("/", (request, response) => {
    // Lägg till säkerhetsinställningar för Cookies
    app.use(session({
        secret: "Jens the dev",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        }
    }))
    response.status(201).send({ msg: "hello!" });
})

app.get("/users", query('filter').isString().notEmpty().withMessage('must not be empty').isLength({ min: 3, max: 10 }).withMessage('must be atleast 3-10 char'), (request, response) => {
    // console.log(request.query, 'request.query');
    // console.log(request['express-validator#contexts'], 'request');

    const result = validationResult(request); // get the validation object
    console.log(result, 'result');

    const { query: { filter, value }, } = request;

    if (filter && value) {
        return response.send(users.filter((user) => user[filter].includes(value)));
    }

    return response.send(users);
});

app.post("/users",
    [body('name')
        .notEmpty().withMessage('username canot be empty')
        .isLength({ min: 5, max: 52 }).withMessage('username must be 5-52 char')
        .isString().withMessage('username must be string'),
    body('age').notEmpty(),]
    , (request, response) => {

        const result = validationResult(request)
        console.log(result, 'result');

        const { body } = request;
        console.log(users.length, 'users.length');
        const newUser = { id: users[length - 1].id + 1, ...body };
        users.push(newUser);
        return response.status(201).send(newUser);
    })
// 18:00 https://www.youtube.com/watch?v=4ugw5yRwhR0

app.listen(PORT, () => {
    console.log(`server is running on localhost/${PORT}`)
})