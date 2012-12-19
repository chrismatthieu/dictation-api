WAV-to-Text API

Requires Sox (brew install sox)
Requires Node.JS 
Requires Stenographer NPM module installed gloabally (npm install stenographer -g)

sox input.mp3 output.wav
cat allison.wav | stenographer -t wav

