var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

//SET UP DATABASE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotesdb');

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
}, {timestamps: true})

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
})

app.get('/quotes', function(req, res){
    var allQuotes = [];
    Quote.find({}, function(err, quotes){
        allQuotes = quotes;
        res.render('quotes', { quotes: allQuotes });
    }).sort({createdAt: -1});

})

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote(req.body);
    quote.save(function(err){
        if(err){
            res.render('index', { title: 'You have errors!!', errors: quote.errors });
        }
        else {
            res.redirect('/quotes')
        }
    })

})

app.listen(8000, function() {
    console.log("listening on port 8000");
})
