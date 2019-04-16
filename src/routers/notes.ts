import * as express from 'express';
import {ServerError} from "../utils/error";
import {Note} from "../common";


const delay = 1200;

export const notesRouter = express.Router();
const notes: Note[] = [
    {id: 1, text: 'bear', status: 'saved'},
    {id: 2, text: 'cat', status: 'saved'},
    {id: 3, text: 'dog', status: 'saved'}
];

notesRouter.get('/', (req, res) => {
    setTimeout(() => res.json(notes), delay);
});

notesRouter.post('/', (req, res) => {
    const text = getText(req);
    const id = getNextId();
    const note = {id, text, status: 'saved'};
    notes.push(note);
    setTimeout(() => res.json(note), delay);
});

notesRouter.put('/:id', (req, res) => {
    const text = getText(req);
    const index = getIndex(req);
    notes[index].text = text;
    notes[index].status = 'saved';
    setTimeout(() => res.json(notes[index]), delay);
});

notesRouter.delete('/:id', (req, res) => {
    const index = getIndex(req);
    const note = notes[index];
    notes.splice(index,1);
    setTimeout(() => res.json(note), delay);
});

///

function getText(req): string {
    if (req.body.text && typeof req.body.text === 'string' && req.body.text.length <= 10) {
        return req.body.text;
    } else {
        throw new ServerError(400, 'Invalid text');
    }
}

function getIndex(req): number {
    const id = +req.params.id;
    const index = notes.findIndex(n => n.id === id);
    if (index => 0) {
        return index;
    } else {
        throw new ServerError(400, 'Invalid id');
    }
}

function getNextId(): number {
    return notes.reduce((a, n) => n.id > a ? n.id : a, 0) + 1;
}
