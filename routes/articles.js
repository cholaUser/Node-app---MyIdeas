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

router.get('/:id', async (req,res) => { //było /:id
    try{
        const article = await Article.findById(req.params.id)
        res.render('articles/show', {article: article, title: ""})
    } catch (e) {
        res.redirect('/')
    }
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
            article.markdown = req.body.markdown
        try {
            article = await article.save()  //zwraca error przy pustym title lub markdown (są required w bazie)
            res.redirect(`/articles/${article.id}`);    //czemu nie zaskoczyło wcześniej ? XD
        } catch (e) {
            console.log(e)
            res.render(`articles/${path}`, {article: article, title: ""})  //dla pewności że to poprzedni artykuł (pola będą wypełnione)
        }
    }
}

module.exports = router