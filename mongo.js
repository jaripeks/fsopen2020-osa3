const mongoose = require('mongoose')

const argCount = process.argv.length

if (argCount < 3) {
	console.log('give atleas a password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jaripeks:${password}@cluster0-tsmee.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})

const Person = mongoose.model('Person', personSchema)

if (argCount === 3) {
	Person.find({}).then(res => {
		console.log('phonebook')
		res.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
} else if (argCount === 5) {
	const name = process.argv[3]
	const number = process.argv[4]
	const person = new Person({ name, number })
	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}