var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var drankSchema = new mongoose.Schema({naam:String,prijs:String,url:String});
var Drank = mongoose.model('drank',drankSchema);
var http = require('http').Server(app);
var io = require('socket.io');
const port = 2000;
const socket = io(http);
var arrNaam = [];
var arrPrijs = [];
var arrURL = [];
// view engine setup
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'node_modules/socket.io-client/dist/')));
app.listen(process.env.PORT || 3000 , process.env.IP || '0.0.0.0');
//connectie met database
mongoose.connect("mongodb+srv://admin:Project123@projectkk-qrdxb.azure.mongodb.net/dranken?retryWrites=true", function(err) {
    if (err) throw err;
    console.log("Successfully connected to mongodb");
  });
//post
app.post('/post', function(req, res){
  delete req.body._id;
  var drankNew = new Drank(req.body);
  drankNew.save(function(err){
    if(err)throw err;
      console.log("post saved!!");
  })
  console.log(JSON.stringify(req.body));
  res.redirect('/');
  //res.send("received your request!: "+ JSON.stringify(req.body));
  
});
//get
app.get('/list',function(req,res){
 Drank.find(null, function(err,docs){
  if(err)throw err;
  arrNaam = [];
  arrPrijs = [];
  arrURL = [];
  for(var i = 0;i<docs.length;i++){
    arrNaam.push(docs[i].naam);
    arrPrijs.push(docs[i].prijs);
    arrURL.push(docs[i].url);
  }
  res.render('lijst',{naam: arrNaam, prijs: arrPrijs, url: arrURL, title:"lijst"});
 });
});

http.listen(port, ()=>{
  console.log("connected to port: "+ port)
  });
socket.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      socket.emit('chat message', msg);
    });
});
module.exports = app;
