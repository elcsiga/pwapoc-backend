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
    const text = getText(req.body.text);
    const id = getNextId();
    const note = {id, text, status: 'saved'};
    notes.push(note);
    setTimeout(() => res.json(note), delay);
});

notesRouter.put('/:id', (req, res) => {
    const text = getText(req.body.text);
    const index = getIndex(+req.params.id);
    notes[index].text = text;
    notes[index].status = 'saved';
    setTimeout(() => res.json(notes[index]), delay);
});

notesRouter.delete('/:id', (req, res) => {
    const index = getIndex(+req.params.id);
    const note = notes[index];
    notes.splice(index,1);
    setTimeout(() => res.json(note), delay);
});

//////////////////////////

notesRouter.post('/sync', (req, res) => {

    const notes = req.body.notes;
    for (let note of notes) {

        console.log('SYNC PROCESSING:', note);

        // new element
        if (note.status === 'cached' && note.id >= 1000) {
            const text = getText(note.text);
            const id = getNextId();
            const newNote = {id, text, status: 'saved'};
            notes.push(newNote);
            console.log('NOTE ADDED:', newNote);
        }

        // deleted element
        else if (note.status == 'deleted') {
            const index = getIndex(note.id);
            const notesDeleted = notes.splice(index,1);
            console.log('NOTE DELETED:', notesDeleted);
        }

        // modified element
        else if (note.status === 'cached') {
            const text = getText(note.text);
            const index = getIndex(note.id);
            notes[index].text = text;
            notes[index].status = 'saved';
            console.log('NODE MODIFIED:', notes[index]);
        }
    }

    setTimeout(() => res.json(notes), delay);
});

//////////////////////////

function getText(text): string {
    if (text && typeof text === 'string' && text.length <= 10) {
        return text;
    } else {
        throw new ServerError(400, 'Invalid text');
    }
}

function getIndex(id): number {
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
