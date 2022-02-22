const express = require('express')
const Idea = require('../models/idea')
const router = express.Router()


router.get('/new', (req,res) => {
    res.render('ideas/new', {idea: new Idea(), title: ""})
})  //ścieżka jest relatywna do tego pliku / to nie jest prawdziwy startowy route

router.get('/edit/:id', async (req, res) => {
    const idea = await Idea.findById(req.params.id)
    res.render('ideas/edit', { idea: idea, title: ""})
})

router.get('/:id', async (req,res) => { //było /:id
    try{
        const idea = await Idea.findById(req.params.id) //param odnosi się do id z path?
        res.render('ideas/show', {idea: idea, title: ""})
    } catch (e) {
        res.redirect('/')
    }
})

router.post('/', async (req,res, next) => {
    req.idea = new Idea()   //req.idea dostaje id
    next()  //idź do saveIdea
}, saveIdeaAndRedirect('new'))

router.put('/:id', async (req,res, next) => {
    req.idea = await Idea.findById(req.params.id)
    next()  //idź do saveIdea
}, saveIdeaAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Idea.findByIdAndDelete(req.params.id)  //usuwa z bazy danych
    res.redirect('/')
})


function saveIdeaAndRedirect(path) { //dla post i put bo sie powtarza kod
    return async (req, res) => {
        let idea = req.idea
        idea.title = req.body.title
        idea.content = req.body.content
        try {
            idea = await idea.save()  //zwraca error przy pustym title lub content (są required w bazie)
            res.redirect(`/ideas/${idea.id}`);    //czemu nie zaskoczyło wcześniej ? XD
        } catch (e) {
            console.log(e)
            res.render(`ideas/${path}`, {idea: idea, title: ""})  //dla pewności że to poprzedni artykuł (pola będą wypełnione)
        }
    }
}

module.exports = router
