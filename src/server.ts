import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import {errorHandler, sendError} from "./utils/error";
import {testRouter} from "./routers/test";
import {notesRouter} from "./routers/notes";

async function main() {
    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.static(__dirname + '/ui'));

    //logger
    app.use(function (req, res, next) {
        console.log('_________________________________');
        console.log('REQUEST:', req.method, req.originalUrl);
        next();
    });

    //modules
    app.use('/api/test', testRouter);
    app.use('/api/notes', notesRouter);

    //error handler
    app.use(errorHandler);

    const port = process.env.PORT || 3000;
    console.log(`Listening on ${port}`);
    app.listen(port);
}

main().catch(err => console.error(err));














