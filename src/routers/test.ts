
import * as express from 'express';
import { sendError } from "../utils/error";
export const testRouter = express.Router();

testRouter.get('/', (req, res) => {
    res.json({
        api: 'ready'
    });
});

testRouter.get('/error', (req, res) => {
    sendError(res, 444, 'Api error test');
});
