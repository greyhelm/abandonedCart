const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

// connect to db and handle errors
mongoose.connect('mongodb://localhost:27017/shortUrl', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(res => console.log("Connected to DB")).catch(err => console.log(err))

// set ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

// get all urls and render page
app.get('/', async (req, res) => {
    console.log("get")
    const urls = await ShortUrl.find();
    res.render('index', {shortUrls: urls});
})

// create a new url in db
app.post('/shortUrl', async (req, res) => {
    console.log("post")
    await ShortUrl.create({original: req.body.original});

    res.redirect('/');
})

// find the original url associated with short url and redirect
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.linkUsage++
    shortUrl.save()

    res.redirect(shortUrl.original)
})

app.listen(3000);