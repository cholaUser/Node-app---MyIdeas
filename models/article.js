const mongoose = require('mongoose')
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    markdown: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now   //bo date przyjmuje funkcje
    },
    sanitizedHtml: {    //wyświetlany jest sanitizedHtml a nie markdown/content
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function (next) { // funkcja wywoła się za każdym razem po save, update, delete itd
    if (this.markdown) {    //marked - konwersja do html, sanitize - usuwa szkodliwy kod
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }

    next() //bardzo ważne!!!
})

module.exports = mongoose.model('Article', articleSchema)       // eksportuje klase  articleSchma ale o nazwie Article?
