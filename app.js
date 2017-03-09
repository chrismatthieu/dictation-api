'use strict';

var express = require('express');
var routes = require('./routes');
const expressFileupload = require("express-fileupload");
var request = require('superagent');
// var speech = require('google-speech-api');

var app = express();
app.use(expressFileupload());

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/audio/new', function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>file: <input type="file" name="audio" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
});

app.post('/audio/new', function(req, res) {
  console.log(req.files);
  let sampleFile = req.files.audio;
  // sampleFile.mv('./public/audio/temp.raw');
  sampleFile.mv('./public/audio/temp.wav');

  // Google Speech API
  // // Imports the Google Cloud client library
  // const Speech = require('@google-cloud/speech');
  //
  // // Your Google Cloud Platform project ID
  // const projectId = 'dictation-159501';
  //
  // // Instantiates a client
  // const speechClient = Speech({
  //   projectId: projectId
  // });
  //
  // // The name of the audio file to transcribe
  // // const fileName = './public/audio/audio.raw';
  // // const fileName = './public/audio/Audio.mp3';
  // const fileName = './public/audio/temp.raw';
  //
  // // The audio file's encoding and sample rate
  // const options = {
  //   encoding: 'LINEAR16',
  //   // encoding: 'FLAC',
  //   sampleRate: 16000
  // };
  //
  // // Detects speech in the audio file
  // speechClient.recognize(fileName, options)
  //   .then((results) => {
  //     const transcription = results[0];
  //     console.log(`Transcription: ${transcription}`);
  //     res.send(`Transcription: ${transcription}`);
  //   });




  // IBM Watson / BlueMix
  var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
  var fs = require('fs');

  var speech_to_text = new SpeechToTextV1({
    username: 'watson-speech-to-text-username',
    password: 'watson-speech-to-text-password'
  });

  var params = {
    // From file
    audio: fs.createReadStream('./public/audio/temp.wav'),
    content_type: 'audio/l16; rate=44100'
  };

  speech_to_text.recognize(params, function(err, result) {
    if (err)
      console.log(err);
    else
      // console.log(JSON.stringify(res, null, 2));
      console.log(`Transcription: ${JSON.stringify(result, null, 2)}`);
      res.send(`Transcription: ${JSON.stringify(result, null, 2)}`);
  });

  // // or streaming
  // fs.createReadStream('./resources/speech.wav')
  //   .pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=44100' }))
  //   .pipe(fs.createWriteStream('./transcription.txt'));

});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
