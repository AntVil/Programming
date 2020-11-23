
const fs = require('fs');
const portAudio = require('naudiodon');



class AudioHandler {
    constructor() {

    }

    initializeAudio() {
        let audioIO = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: -1,
                closeOnError: true
            }
        }); 
        return audioIO;
    }

    playAudio(filename) {
        filename = filename + ".wav";
        filename = './src/audio/' + filename;
        let audioIO = this.initializeAudio();
        console.log(`'${filename}'`)
        let rs = fs.createReadStream(filename);
        console.log(rs);
        rs.pipe(audioIO);
        audioIO.start();
    }
}
exports.AudioHandler = AudioHandler;

