
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , spawn = require('child_process').spawn
  , filed = require('filed');

var app = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/audio/new', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>file: <input type="file" name="audio" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/audio/new', function(req, res) {

  
  var tts = spawn('stenographer', ['-t', 'wav']);
  filed(req.files.audio.path).pipe(tts.stdin);

  // processAudio(req.files.audio.path, function(result){
    // console.log(result);
    // res.send('Uploaded ' + req.files.audio.name + ' to ' + req.files.audio.path);
    tts.stdout.pipe(res);
  // })
  
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
