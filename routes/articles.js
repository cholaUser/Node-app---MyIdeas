const express = require('express')
const Article = require('./../models/article')
const router = express.Router()


router.get('/new', (req,res) => {
    res.render('articles/new', {article: new Article(), title: ""})
})  //ścieżka jest relatywna do tego pliku / to nie jest prawdziwy startowy route

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article, title: ""})
})

router.get('/:slug', async (req,res) => { //było /:id
    const article = await Article.findOne({ slug: req.params.slug })   //było findById
    if (article == null) res.redirect('/')
    res.render('articles/show', {article: article, title: ""})
})

router.post('/', async (req,res, next) => {
    req.article = new Article()
    next()  //idź do saveArticle
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req,res, next) => {
    req.article = await Article.findById(req.params.id)
    next()  //idź do saveArticle
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)  //usuwa z bazy danych
    res.redirect('/')
})



function saveArticleAndRedirect(path) { //dla post i put bo sie powtarza kod
    return async (req, res) => {
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
        try{
            if (article.title.replace(/\s+/g, '') === ""){
                res.render(`/articles/${path}`, {article: new Article()})
            }
            if (article.markdown.replace(/\s+/g, '') === ""){
                res.render(`/articles/${path}`, {article: new Article()})
            }
            article = await article.save()  //jest error przy save jeśli jakieś pole jest puste a w bazie jest required
            res.redirect(`/articles/${article.slug}`);    //czemu nie zaskoczyło wcześniej ? XD
        } catch (e) {
            res.render(`/articles/${path}`, {article: article})  //dla pewności że to poprzedni artykuł (pola będą wypełnione)
        }
    }
}

module.exports = router