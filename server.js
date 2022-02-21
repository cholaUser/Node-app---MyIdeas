const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')             //?????????????????????????????????????????????????????????????
const methodOverride = require('method-override')
const app = express()
const articleRouter = require('./routes/articles')

app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://localhost/blogTEST', {
    useNewUrlParser: true, useUnifiedTopology: true //, useCreateIndex: true
})    //blog - nazwa DB

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))  //????????????????????????????????????????????????????????????? req.body?
app.use(methodOverride('_method'))  //pozwala na wykorzystanie delete router

app.get('/', async (req, res) => {             //async ???????
    const articles = await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index', {articles: articles, title: ""})          //podmienić zmienną articles (usunąć elementy po search) ALBO przekazać dodatkową zmienną i porównywać id w ejs
})

app.post('/', async (req, res) => {
    if (req.body.title.replace(/\s+/g, '') === "") //null?      //usunąć spacje z req.body.title
        res.redirect('/')
    else{
        const articlesDB = await Article.find( {title: {'$regex': req.body.title.trim()}}).sort({createdAt: 'desc'})
        res.render('articles/index', {articles: articlesDB, title: req.body.title})
    }
})

app.use('/articles', articleRouter)

app.listen(4200)
