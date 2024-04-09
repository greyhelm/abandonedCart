const express = require('express');
const mongoose = require('mongoose');
const AbandonedCartModel = require('./models/abandonCartModel');
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

// get all abandoned carts and render page
app.get('/', async (req, res) => {
    console.log("get")
    const carts = await AbandonedCartModel.find();
    //res.render('index', {abandonedCartObj: carts});
    res.json( [carts] )
})

// create a new abandoned cart obj in db
app.post('/abandonedCart', async (req, res) => {
    console.log("post")
    console.log(req.body);
    const abandonedCartObj = aCService.handleJSON( req.body );
    console.log(JSON.stringify(abandonedCartObj));

    const test = new AbandonedCartModel(abandonedCartObj);
    const response = await test.save();
    //await AbandonedCartModel.create({abandonedCartObj: abandonedCartObj});

    res.redirect('/');
})


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});