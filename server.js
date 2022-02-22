const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ideaRouter = require('./routes/ideas')
const Idea = require('./models/idea')
const methodOverride = require('method-override')

app.use(express.static(__dirname + '/public'))  //dirname - ścieżka do do tego pliku -> wystarczy że będę używał /img/plik albo /css/style.css

mongoose.connect('mongodb://localhost/ideaDB', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true //nie potrzebne w aktualnej wersji mongoose
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))  //potrzebne do POST, PUT - req.body
app.use(methodOverride('_method'))  //pozwala na wykorzystanie delete router (i put?)

app.get('/', async (req, res) => {             //async ???????
    const ideas = await Idea.find().sort({createdAt: 'desc'})   //async - funkcja zawiesza działanie dopóki nie znajdzie wyniku
    res.render('ideas/index', {ideas: ideas, title: ""})          //podmienić zmienną ideas (usunąć elementy po search) ALBO przekazać dodatkową zmienną i porównywać id w ejs
})

app.post('/', async (req, res) => {
    if (req.body.title.replace(/\s+/g, '') === "") //regex - usunięcie spacji
        res.redirect('/')
    else{
        //SELECT * FROM ideas WHERE title LIKE '%req.body.title.trim()%'
        const ideasDB = await Idea.find( {title: {'$regex': req.body.title.trim()}}).sort({createdAt: 'desc'})
        res.render('ideas/index', {ideas: ideasDB, title: req.body.title})
    }
})

app.use('/ideas', ideaRouter) //tutaj bo wcześniej używałem /ideas

app.listen(4200)
