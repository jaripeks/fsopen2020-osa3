require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const baseUrl = '/api/persons'
const Person = require('./models/person')
const middleware = require('./utils/middleware')


morgan.token('body', (req) => {
	const person = JSON.stringify({ name: req.body.name, number: req.body.number })
	return person !== '{}' ? person : ' '
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get(`${baseUrl}/:id`, (req, res, next) => {
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

app.delete(`${baseUrl}/:id`, (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(deleted => {
			console.log(deleted)
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.post(baseUrl, (req, res, next) => {
	const body = req.body

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

app.put(`${baseUrl}/:id`, (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson.toJSON())
		})
		.catch(error => next(error))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app