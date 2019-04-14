import * as express from 'express';
import {ServerError} from "../utils/error";
import {Note} from "../common";

export const notesRouter = express.Router();
const notes: Note[] = [
    {id: 1, text: 'bear'},
    {id: 2, text: 'cat'},
    {id: 3, text: 'dog'}
];

notesRouter.get('/', (req, res) => {
    res.json(notes);
});

notesRouter.post('/', (req, res) => {
    const text = getText(req);
    const id = getNextId();
    const note = {id, text};
    notes.push(note);
    res.json(note);
});

notesRouter.put('/:id', (req, res) => {
    const text = getText(req);
    const index = getIndex(req);
    notes[index].text = text;
    res.json(notes[index]);
});

notesRouter.delete('/:id', (req, res) => {
    const index = getIndex(req);
    const note = notes[index];
    notes.splice(index,1);
    res.json(note);
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
