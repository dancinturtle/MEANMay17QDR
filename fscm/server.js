//dependencies
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");

//create express app
var app = express();

//use body-parser
app.use(bodyParser.urlencoded({extended:true}));

//mongoose
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quotes')
mongoose.Promise = global.Promise;

var QuoteSchema = new mongoose.Schema({
  name: {type: String, required: true, minlength: 2},
  quote: {type: String, required: true, minlength: 10}
}, {timestamps: true});

mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

//set up views
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//root route
app.get('/', function (req, res){
  res.render('index');
});

//process route
app.post('/quotes', function(req, res){
  console.log("POST DATA", req.body);
  var quote = new Quote({name: req.body.name, quote: req.body.quote});
  quote.save(function(err){
    if(err){
      // console.log('error')
      console.log(quote.errors);
      res.render('index', {title: 'you have errors!', errors: quote.errors})
    }
    else{
      console.log('success')
      res.redirect('/quotes')
    }
  })
})

//quote display route
app.get('/quotes', function(req, res){
  Quote.find({}).sort('-createdAt').exec(function(err, quotes){
    if(err){
      // console.log('error')
      console.log(quote.errors);
      res.render('quotes', {title: 'you have errors!', errors: quote.errors})
    }
    else{
      console.log('success')
      res.render('quotes', {quotes: quotes})
  }})
})

//server
var server = app.listen(8000, function(){
  console.log("listening on port 8000")
});
