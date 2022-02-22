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
        default: Date.now   //bo date przyjmuje funkcje
    },
    sanitizedHtml: {    //wyświetlany jest sanitizedHtml a nie content
        type: String,
        required: true
    }
})

ideaSchema.pre('validate', function (next) { //save/update
    if (this.content) {    //marked - konwersja do html, sanitize - usuwa szkodliwy kod
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.content))
    }

    next() //bardzo ważne!!!
})

module.exports = mongoose.model('Idea', ideaSchema)       // eksportuje klase  ideaSchma ale o nazwie Idea?
