const mongoose = require('mongoose')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


const ideaSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

ideaSchema.pre('validate', function (next) { //wywołane przed save
    if (this.content) {    //marked - konwersja do html, sanitize - usuwa potencjalnie szkodliwy kod
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
    }

    next()
})

module.exports = mongoose.model('Idea', ideaSchema)
