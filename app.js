const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const baseUrl = '/api/persons'

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Masa Testimiäs",
        "number": "111222333-4",
        "id": 5
    }
]

const getId = () => {
    return Math.floor(Math.random() * Math.floor(1000000))
}

morgan.token('body', (req) => {
    const person = JSON.stringify({ name: req.body.name, number: req.body.number })
    return person !== '{}' ? person : ' '
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
    res.send(
        `<div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date()}</div>`
    )
})

app.get(baseUrl, (req, res) => {
    res.json(persons)
})

app.get(`${baseUrl}/:id`, (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete(`${baseUrl}/:id`, (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post(baseUrl, (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (!body.number) {
        return res.status(400).json({ error: 'number missing' })
    }
    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getId()
    }

    persons = persons.concat(person)
    res.json(person)
})

module.exports = app