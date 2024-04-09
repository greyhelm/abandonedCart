const express = require('express');
const mongoose = require('mongoose');
const AbandonedCartModel = require('./models/abandonCartModel');
const aCService = require("./services/abandonCartService");
const bodyParser = require('body-parser');
const req = require("express/lib/request");
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
    const carts = await AbandonedCartModel.find();
    res.render('index', {abandonedCartObj: carts});
})

// get all abandoned carts and return JSON
app.get('/abandonedCart', async (req, res) => {
    const carts = await AbandonedCartModel.find();
    res.json( [carts] )
})

// create a new abandoned cart obj in db
app.post('/abandonedCart', async (req, res) => {

    const abandonedCartObj = aCService.handleJSON( req.body );
    console.log("Adding new AbandonedCart for " + abandonedCartObj.customerID);
    const acModel = new AbandonedCartModel(abandonedCartObj);
    await acModel.save();

    res.redirect('/');
})

app.delete('/abandonedCart/delete', async (req, res) => {

    console.log("deleting ID: " + req.body.customerID);
    await AbandonedCartModel.deleteOne({ customerID: req.body.customerID } ).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });
    res.redirect('/');
})


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});