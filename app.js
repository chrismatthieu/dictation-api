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
  sampleFile.mv('./public/audio/temp.raw');

  // var opts = {
  //   filetype: 'mp3',
  //   key: key
  // };
  // request
  //   // .get(req.files.audio.path)
  //   .get(req.files.audio)
  //   .pipe(speech(opts, function (err, results) {
  //     // handle the results
  //     console.log(results);
  //   }));




  // var opts = {
  //   file: './audio/allison.flac',
  //   keyFilename: './keyfile.json'
  // };
  //
  // speech(opts, function (err, results) {
  //   console.log(results);
  //   res.send(results);
  //   // [{result: [{alternative: [{transcript: '...'}]}]}]
  // });



  // var tts = spawn('stenographer', ['-t', 'wav']);
  // filed(req.files.audio.path).pipe(tts.stdin);

  // // processAudio(req.files.audio.path, function(result){
  //   // console.log(result);
  //   // res.send('Uploaded ' + req.files.audio.name + ' to ' + req.files.audio.path);
  //   tts.stdout.pipe(res);
  // // })



  // var googspeech = require('@google-cloud/speech')({
  //   projectId: 'dictation-159501'
  //   // keyFilename: require('./keyfile.json'),
  //   // credentials: require('./keyfile.json')
  // });
  // googspeech.recognize('./audio/allison.flac', {
  //   encoding: 'FLAC',
  //   sampleRate: 16000,
  //   languageCode: 'en-US'
  // }, function(err, transcript) {
  //   console.log(transcript);
  // });




  // // [START speech_async_recognize]
  // // Imports the Google Cloud client library
  // const Speech = require('@google-cloud/speech');
  //
  // // Instantiates a client
  // const speech = Speech({
  //   projectId: 'dictation-159501',
  //   keyFilename: '/Users/topher/Projects/Misc/dictation-api/keyfile.json',
  //   languageCode: 'en-US',
  //   credentials: require('./keyfile.json')
  // });
  //
  // // The path to the local file on which to perform speech recognition, e.g. /path/to/audio.raw
  // // const filename = '/path/to/audio.raw';
  //
  // // The encoding of the audio file, e.g. 'LINEAR16'
  // // const encoding = 'LINEAR16';
  //
  // // The sample rate of the audio file, e.g. 16000
  // // const sampleRate = 16000;
  //
  // const request = {
  //   encoding: 'FLAC',
  //   sampleRate: 16000,
  //   languageCode: 'en-US'
  // };
  //
  // // Detects speech in the audio file. This creates a recognition job that you
  // // can wait for now, or get its result later.
  // speech.startRecognition('/Users/topher/Projects/Misc/dictation-api/audio/allison.flac', request)
  //   .then((results) => {
  //     const operation = results[0];
  //     // Get a Promise represention of the final result of the job
  //     return operation.promise();
  //   })
  //   .then((transcription) => {
  //     console.log(`Transcription: ${transcription}`);
  //   });
  // // [END speech_async_recognize]





  // [START speech_quickstart]
  // Imports the Google Cloud client library
  const Speech = require('@google-cloud/speech');

  // Your Google Cloud Platform project ID
  const projectId = 'dictation-159501';

  // Instantiates a client
  const speechClient = Speech({
    projectId: projectId
  });

  // The name of the audio file to transcribe
  // const fileName = './public/audio/audio.raw';
  // const fileName = './public/audio/Audio.mp3';
  const fileName = './public/audio/temp.raw';

  // The audio file's encoding and sample rate
  const options = {
    encoding: 'LINEAR16',
    // encoding: 'FLAC',
    sampleRate: 16000
  };

  // Detects speech in the audio file
  speechClient.recognize(fileName, options)
    .then((results) => {
      const transcription = results[0];
      console.log(`Transcription: ${transcription}`);
      res.send(`Transcription: ${transcription}`);
    });
  // [END speech_quickstart]



});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
