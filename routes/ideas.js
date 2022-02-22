const express = require('express')
const Idea = require('../models/idea')
const router = express.Router()


router.get('/new', (req,res) => {
    res.render('ideas/new', {idea: new Idea(), title: ""})
})

router.get('/edit/:id', async (req, res) => {
    const idea = await Idea.findById(req.params.id)
    res.render('ideas/edit', { idea: idea, title: ""})
})

router.get('/:id', async (req,res) => {
    try{
        const idea = await Idea.findById(req.params.id)
        res.render('ideas/show', {idea: idea, title: ""})
    } catch (e) {
        res.redirect('/')
    }
})

router.post('/', async (req,res, next) => {
    req.idea = new Idea()
    next()
}, saveIdeaAndRedirect('new'))

router.put('/:id', async (req,res, next) => {
    req.idea = await Idea.findById(req.params.id)
    next()
}, saveIdeaAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Idea.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


function saveIdeaAndRedirect(path) { //powtarzający się kod dla edit i new
    return async (req, res) => {
        let idea = req.idea
        idea.title = req.body.title
        idea.content = req.body.content
        try {
            idea = await idea.save()  //zwraca error przy pustym title lub content (są required w BD)
            res.redirect(`/ideas/${idea.id}`);
        } catch (e) {
            //console.log(e)
            res.render(`ideas/${path}`, {idea: idea, title: ""})
        }
    }
}

module.exports = router
