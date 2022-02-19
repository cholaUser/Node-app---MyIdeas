const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


const articleSchema = new mongoose.Schema({     //Schema??????????????????????????????
    title: {
        required: true,
        type: String
    },
    description: {
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
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function (next) { // funkcja wywoła się za każdym razem po save, update, delete itd
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
        //usunie się np : , / ze ścieżki z url
    }

    if (this.markdown) {    //marked - konwersja do html, sanitize - usuwa szkodliwy kod
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }

    next() //bardzo ważne!!!
})

module.exports = mongoose.model('Article', articleSchema)       //?????????????????????? eksportuje klase jak articleSchma ale o nazwie Article?