var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
 name: {type: String, required: [true, "Name is required"]},
 quote: {type: String, required: [true, "Quote is required"]}
}, { timestamps: { createdAt: 'created_at' } });
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote')


app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
 res.render("index");
})

app.post('/quotes', function(req, res) {
  var quote = new Quote({name: req.body.name, quote: req.body.quote});
  quote.save(function(err) {
    if(err) {
      errors = []
      for(message in err.errors)
        {errors.push(err.errors[message].message);}
      console.log('something went wrong');
      res.render('index');
    } else {
      console.log('successfully added a quote!');
      res.redirect('/quotes');
    }
  })
})

app.get('/quotes', function(req, res) {
  Quote.find({}, function(err, quotes) {
    if(err) {
      console.log('something went wrong');
    } else {
      all_quotes = quotes;
      console.log('successfully retrieved quotes!');
      res.render("show");
    }
  })
})


app.listen(8000, function() {
    console.log("listening on port 8000");
})
