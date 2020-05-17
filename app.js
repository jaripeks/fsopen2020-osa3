require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const baseUrl = '/api/persons'
const Person = require('./models/person')


morgan.token('body', (req) => {
    const person = JSON.stringify({ name: req.body.name, number: req.body.number })
    return person !== '{}' ? person : ' '
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        res.send(
            `<div>Phonebook has info for ${persons.length} people</div>
            <div>${new Date()}</div>`
        )
    })
})

app.get(baseUrl, (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons.map(p => p.toJSON()))
        })
})

app.get(`${baseUrl}/:id`, (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
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

app.post(baseUrl, (req, res, next) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (!body.number) {
        return res.status(400).json({ error: 'number missing' })
    }
    /*  
     if (persons.find(p => p.name === body.name)) {
         return res.status(400).json({ error: 'name must be unique' })
     }
    */
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(formattedPerson => {
            console.log(formattedPerson)
            res.json(formattedPerson)
        })
        .catch(error => next(error))
})

module.exports = app