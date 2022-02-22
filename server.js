const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ideaRouter = require('./routes/ideas')
const Idea = require('./models/idea')
const methodOverride = require('method-override')

app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://localhost/ideaDB', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true //niepotrzebne w aktualnej wersji mongoose
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))  //POST req.body
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const ideas = await Idea.find().sort({createdAt: 'desc'})
    res.render('ideas/index', {ideas: ideas, title: ""})
})

app.post('/', async (req, res) => {
    if (req.body.title.replace(/\s+/g, '') === "") //regex - usunięcie whitespace
        res.redirect('/')
    else{
        //SELECT * FROM ideas WHERE title LIKE '%req.body.title.trim()%'
        const ideasDB = await Idea.find( {title: {'$regex': req.body.title.trim()}}).sort({createdAt: 'desc'})
        res.render('ideas/index', {ideas: ideasDB, title: req.body.title})
    }
})

app.use('/ideas', ideaRouter) //

app.listen(4200)
