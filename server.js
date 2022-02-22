const express = require('express')
const app = express()
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const Article = require('./models/article')
const methodOverride = require('method-override')

app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://localhost/ideaDB', {
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))  //req.body?
app.use(methodOverride('_method'))  //pozwala na wykorzystanie delete router (i put?)

app.get('/', async (req, res) => {             //async ???????
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles, title: ""})          //podmienić zmienną articles (usunąć elementy po search) ALBO przekazać dodatkową zmienną i porównywać id w ejs
})

app.post('/', async (req, res) => {
    if (req.body.title.replace(/\s+/g, '') === "") //regex - usunięcie spacji
        res.redirect('/')
    else{
        //SELECT * FROM articles WHERE title LIKE '%req.body.title.trim()%'
        const articlesDB = await Article.find( {title: {'$regex': req.body.title.trim()}}).sort({createdAt: 'desc'})
        res.render('articles/index', {articles: articlesDB, title: req.body.title})
    }
})

app.use('/articles', articleRouter) //tutaj bo wcześniej używałem /article

app.listen(4200)
