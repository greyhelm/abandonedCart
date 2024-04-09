const express = require('express');
const mongoose = require('mongoose');
const AbandonedCart = require('./models/abandonCartModel');
const aCService = require("./services/abandonCartService");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

//used to parse JSON data from req.body
app.use(bodyParser.json());

// connect to db and handle errors
mongoose.connect('mongodb://localhost:27017/abandonedCart', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(res => console.log("Connected to DB")).catch(err => console.log(err))

// set ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/test', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

// get all abandoned carts and render page
app.get('/', async (req, res) => {
    console.log("get")
    const carts = await AbandonedCart.find();
    res.render('index', {abandonedCartObj: carts});
})

// create a new abandoned cart obj in db
app.post('/abandonedCart', async (req, res) => {
    console.log("post")
    console.log(req.body);
    const abandonedCart = aCService.handleJSON( req.body );
    await AbandonedCart.create({abandonedCartObj: abandonedCart});

    res.redirect('/');
})



// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});