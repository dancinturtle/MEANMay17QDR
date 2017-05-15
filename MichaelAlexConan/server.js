var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

//////DataBase Stuff///
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/dojo_quotes');

var QuoteSchema = new mongoose.Schema({
  name: String,
  content: String
},{timestamps: true})

mongoose.model("Quote",QuoteSchema);
var Quote =  mongoose.model('Quote')

///routes ///

app.get('/', function(req, res) {
 res.render("index");
})

app.post('/quotes', function(req,res){
  var new_quote = new Quote();
  new_quote.name = req.body.name;
  new_quote.content = req.body.content;
  new_quote.save(function(err){
    if(err){
      console.log("errors you have errors");
      res.render("/");
    }
    else{
      res.redirect('/results');
    }
  })
})

app.get('/results', function(req,res){
    Quote.find({}, function(err, quotes){
    res.render('results', {collections:quotes});
    
  })

})
