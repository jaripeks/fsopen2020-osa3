const unknownEndpoint = (req, res) => {
    res.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = { unknownEndpoint, errorHandler }