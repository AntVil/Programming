
const fs = require('fs');
const portAudio = require('naudiodon');



class AudioHandler {
    constructor() {
        
    }
    initializeAudio(){
       let audioIO = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: -1,
                closeOnError: true
            }
        });return audioIO
    }
    playAudio(filename){
        let filename = filename + ".wav";
        filename = './audio/' + filename;
        let audioIO = this.initializeAudio();
        rs = fs.createReadStream(filename);
        rs.pipe(audioIO);
        audioIO.start();
    }
}
exports.AudioHandler = AudioHandler;

